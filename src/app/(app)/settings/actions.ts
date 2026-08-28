"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { organizationInputSchema } from "@/lib/validations/organization";
import type { ActionResult } from "@/lib/actions";
import { failure } from "@/lib/actions";

export async function updateOrganization(
  input: unknown,
): Promise<ActionResult> {
  const parsed = organizationInputSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Formulaire invalide");
  }

  const organization = parsed.data;
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

  const { error } = await supabase
    .from("organizations")
    .update({
      name: organization.name,
      legal_name: organization.legalName,
      address: organization.address,
      city: organization.city,
      country: organization.country,
      email: organization.email,
      phone: organization.phone,
      ninea: organization.ninea,
      rccm: organization.rccm,
      currency: organization.currency,
      default_vat_rate: organization.defaultVatRate,
      invoice_prefix: organization.invoicePrefix,
      payment_terms_days: organization.paymentTermsDays,
      invoice_footer_note: organization.invoiceFooterNote,
    })
    .eq("id", profile.organization_id);

  if (error) return failure("Les paramètres n'ont pas pu être enregistrés.");

  revalidatePath("/settings");
  revalidatePath("/invoices");
  return { ok: true };
}
