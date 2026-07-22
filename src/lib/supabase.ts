import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when the app has Supabase credentials wired up. */
export const supabaseReady = Boolean(url && key)

// A single browser client. If env vars are missing we still export a client
// pointed at a placeholder so imports don't crash; auth calls will simply fail
// and the UI shows a "not configured" state via `supabaseReady`.
export const supabase = createClient(url ?? 'http://localhost', key ?? 'public-anon-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
