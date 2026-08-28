"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/actions";
import { failure } from "@/lib/actions";

const credentialsSchema = z.object({
  email: z.string().trim().email("E-mail invalide"),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
});

const signUpSchema = credentialsSchema.extend({
  fullName: z.string().trim().min(1, "Nom requis").max(120),
  companyName: z.string().trim().min(1, "Nom de l'entreprise requis").max(160),
});

/** Redirige uniquement vers un chemin interne, jamais vers un domaine externe. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/dashboard";
}

export async function signIn(
  formData: FormData,
  next: string | null = null,
): Promise<ActionResult> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Identifiants invalides");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return failure("E-mail ou mot de passe incorrect.");

  redirect(safeNext(next));
}

/** Renvoyé quand Supabase exige une confirmation par e-mail avant la connexion. */
export type SignUpResult = ActionResult | { ok: true; pendingConfirmation: true };

export async function signUp(formData: FormData): Promise<SignUpResult> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName"),
  });
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Formulaire invalide");
  }

  const { email, password, fullName, companyName } = parsed.data;
  const supabase = createClient();

  // L'organisation et le profil sont créés par le trigger `handle_new_user`.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, company_name: companyName } },
  });

  if (error) return failure("La création du compte a échoué.");

  if (!data.session) return { ok: true, pendingConfirmation: true };

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
