import { supabase } from './supabase'

async function postAuthed(path: string): Promise<{ url: string }> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const res = await fetch(path, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!res.ok || !body.url) throw new Error(body.error || `Request failed (${res.status})`)
  return { url: body.url }
}

/** Starts Stripe Checkout for the Pro plan and redirects the browser to it. */
export async function startCheckout(): Promise<void> {
  const { url } = await postAuthed('/api/create-checkout-session')
  window.location.href = url
}

/** Opens the Stripe billing portal to manage/cancel the subscription. */
export async function openBillingPortal(): Promise<void> {
  const { url } = await postAuthed('/api/create-portal-session')
  window.location.href = url
}
