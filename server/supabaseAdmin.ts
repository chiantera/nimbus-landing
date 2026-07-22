import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type Env = Record<string, string | undefined>

/** Service-role Supabase client (bypasses RLS). Server-only — never ship this key. */
export function getAdminClient(env: Env): SupabaseClient | null {
  const url = env.SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
