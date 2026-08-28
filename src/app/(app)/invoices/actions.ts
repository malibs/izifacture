"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { computeTotals, lineTotal } from "@/lib/invoice-math";
import { createClient } from "@/lib/supabase/server";
import {
  invoiceInputSchema,
  paymentSchema,
} from "@/lib/validations/invoice";
import type { ActionResult } from "@/lib/actions";
import { failure } from "@/lib/actions";

/**
 * Les totaux sont systématiquement recalculés côté serveur : ceux envoyés par
 * le navigateur ne sont jamais dignes de confiance.
 */
export async function createInvoice(input: unknown): Promise<ActionResult> {
  const parsed = invoiceInputSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Formulaire invalide");
  }

  const invoice = parsed.data;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return failure("Session expirée, reconnectez-vous.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return failure("Profil introuvable.");

  const items = invoice.items.map((item) => ({
    id: crypto.randomUUID(),
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    vatApplicable: item.vatApplicable,
  }));
  const totals = computeTotals(items, invoice.vatRate);

  const { data: number, error: numberError } = await supabase.rpc(
    "next_invoice_number",
    { org_id: profile.organization_id },
  );
  if (numberError || !number) {
    return failure("Impossible de générer le numéro de facture.");
  }

  const { data: created, error: insertError } = await supabase
    .from("invoices")
    .insert({
      organization_id: profile.organization_id,
      client_id: invoice.clientId,
      number,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      vat_rate: invoice.vatRate,
      subtotal: totals.subtotal,
      vat_amount: totals.vat,
      total: totals.total,
      project_name: invoice.projectName,
      notes: invoice.notes,
      terms: invoice.terms,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !created) {
    return failure("La facture n'a pas pu être enregistrée.");
  }

  const { error: itemsError } = await supabase.from("invoice_items").insert(
    items.map((item, position) => ({
      invoice_id: created.id,
      position,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      vat_applicable: item.vatApplicable,
      line_total: lineTotal(item),
    })),
  );

  if (itemsError) {
    // Sans les lignes, la facture serait incohérente : on annule la création.
    await supabase.from("invoices").delete().eq("id", created.id);
    return failure("Les lignes de la facture n'ont pas pu être enregistrées.");
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect(`/invoices/${created.id}`);
}

export async function markInvoiceSent(invoiceId: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from("invoices")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", invoiceId)
    .eq("status", "draft");

  if (error) return failure("La facture n'a pas pu être envoyée.");

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function recordPayment(input: unknown): Promise<ActionResult> {
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Paiement invalide");
  }

  const payment = parsed.data;
  const supabase = createClient();

  const { data: invoice, error: loadError } = await supabase
    .from("invoices")
    .select("id, organization_id, total, amount_paid, status")
    .eq("id", payment.invoiceId)
    .maybeSingle();

  if (loadError || !invoice) return failure("Facture introuvable.");
  if (invoice.status === "draft") {
    return failure("Envoyez la facture avant d'enregistrer un paiement.");
  }

  const amountPaid = invoice.amount_paid + payment.amount;
  if (amountPaid > invoice.total) {
    return failure("Le montant encaissé dépasse le total de la facture.");
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    organization_id: invoice.organization_id,
    invoice_id: invoice.id,
    amount: payment.amount,
    paid_at: `${payment.paidAt}T00:00:00Z`,
    method: payment.method,
    reference: payment.reference,
  });

  if (paymentError) return failure("Le paiement n'a pas pu être enregistré.");

  const settled = amountPaid === invoice.total;
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      amount_paid: amountPaid,
      status: settled ? "paid" : invoice.status,
      paid_at: settled ? new Date().toISOString() : null,
    })
    .eq("id", invoice.id);

  if (updateError) return failure("Le solde de la facture n'a pas été mis à jour.");

  revalidatePath(`/invoices/${invoice.id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { ok: true };
}
