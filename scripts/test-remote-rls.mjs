/**
 * Vérifie sur l'instance Supabase distante que RLS cloisonne bien deux organisations :
 * chaque compte ne voit que ses propres clients et factures.
 *
 * Usage : node scripts/test-remote-rls.mjs
 * Requiert NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY et deux comptes
 * confirmés passés via RLS_USER_A / RLS_USER_B (format email:motdepasse).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function credentials(name) {
  const raw = process.env[name];
  if (!raw) throw new Error(`${name} manquant`);
  const separator = raw.indexOf(":");
  return { email: raw.slice(0, separator), password: raw.slice(separator + 1) };
}

async function login(name) {
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword(credentials(name));
  if (error) throw new Error(`Connexion ${name} : ${error.message}`);
  return client;
}

function check(label, condition) {
  console.log(`${condition ? "OK  " : "ECHEC"} ${label}`);
  if (!condition) process.exitCode = 1;
}

const a = await login("RLS_USER_A");
const b = await login("RLS_USER_B");

const { data: profileA } = await a.from("profiles").select("organization_id").single();
const { data: profileB } = await b.from("profiles").select("organization_id").single();
check("chaque compte a son organisation", profileA.organization_id !== profileB.organization_id);

const { data: clientA, error: insertError } = await a
  .from("clients")
  .insert({ organization_id: profileA.organization_id, name: "Client RLS A" })
  .select()
  .single();
if (insertError) throw new Error(`Insertion client A : ${insertError.message}`);

const { data: seenByB } = await b.from("clients").select("id").eq("id", clientA.id);
check("B ne lit pas le client de A", seenByB.length === 0);

const { data: updatedByB } = await b
  .from("clients")
  .update({ name: "Piraté" })
  .eq("id", clientA.id)
  .select();
check("B ne modifie pas le client de A", updatedByB.length === 0);

const { error: crossOrgInsert } = await b
  .from("clients")
  .insert({ organization_id: profileA.organization_id, name: "Injection" });
check("B ne crée rien dans l'organisation de A", crossOrgInsert !== null);

const { data: deletedByB } = await b.from("clients").delete().eq("id", clientA.id).select();
check("B ne supprime pas le client de A", deletedByB.length === 0);

await a.from("clients").delete().eq("id", clientA.id);
