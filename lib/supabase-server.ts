import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Crée un client Supabase serveur qui lit la session utilisateur
 * depuis les cookies de la requête HTTP. Utilisé dans les Route Handlers
 * authentifiés (ex: /api/payments/create).
 */
export async function createClientFromRequest() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Les cookies ne peuvent pas être définis depuis un Server Component
          // mais c'est OK pour les Route Handlers.
        }
      },
    },
  });
}

/**
 * Crée un client Supabase admin avec la service role key.
 * Contourne le RLS — utilisé UNIQUEMENT dans les webhooks et les
 * opérations serveur de confiance (pas exposé au client).
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. ' +
      'Add it to your .env.local (Supabase → Settings → API → service_role key).',
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}