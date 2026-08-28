"use server";

import { revalidatePath } from "next/cache";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { clientInputSchema } from "@/lib/validations/client";
import type { ActionResult } from "@/lib/actions";
import { failure } from "@/lib/actions";

export async function createClient(input: unknown): Promise<ActionResult> {
  const parsed = clientInputSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Formulaire invalide");
  }

  const client = parsed.data;
  const supabase = createSupabaseClient();

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

  const { error } = await supabase.from("clients").insert({
    organization_id: profile.organization_id,
    name: client.name,
    company_name: client.companyName,
    email: client.email,
    phone: client.phone,
    address: client.address,
    city: client.city,
    country: client.country,
    tax_id: client.taxId,
    notes: client.notes,
  });

  if (error) return failure("Le client n'a pas pu être enregistré.");

  revalidatePath("/clients");
  return { ok: true };
}

export async function updateClient(
  clientId: string,
  input: unknown,
): Promise<ActionResult> {
  const parsed = clientInputSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Formulaire invalide");
  }

  const client = parsed.data;
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("clients")
    .update({
      name: client.name,
      company_name: client.companyName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      country: client.country,
      tax_id: client.taxId,
      notes: client.notes,
    })
    .eq("id", clientId);

  if (error) return failure("Le client n'a pas pu être mis à jour.");

  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  return { ok: true };
}

/** Les clients porteurs de factures ne sont jamais supprimés, seulement archivés. */
export async function archiveClient(clientId: string): Promise<ActionResult> {
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("clients")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", clientId);

  if (error) return failure("Le client n'a pas pu être archivé.");

  revalidatePath("/clients");
  return { ok: true };
}
