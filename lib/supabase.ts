import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Browser client using @supabase/ssr for proper cookie-based auth.
// If the keys are placeholders, the services' catch blocks in StoreContext
// will handle the errors and use mocks.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);