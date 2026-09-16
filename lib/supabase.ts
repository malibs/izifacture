import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// We export a client that will be used by the services.
// If the keys are placeholders, the services' catch blocks in StoreContext will handle the errors and use mocks.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
