import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Supabase client instance initialized using environment variables:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 *
 * If environment variables are not yet provided, this exports null
 * to safely avoid module evaluation errors.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Helper function to retrieve the active Supabase client.
 * Throws a descriptive error if credentials are not configured.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      '[Supabase] Client is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.'
    );
  }
  return supabase;
}
