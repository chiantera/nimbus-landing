import Stripe from 'stripe'
import { getAdminClient, type Env } from './supabaseAdmin.ts'

function getStripe(env: Env): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null
  return new Stripe(env.STRIPE_SECRET_KEY)
}

/** Resolves the signed-in Supabase user from their access token (JWT). */
async function getUserFromToken(env: Env, accessToken: string | undefined) {
  const admin = getAdminClient(env)
  if (!admin) throw new Error('Supabase service role not configured on the server.')
  if (!accessToken) throw new Error('Not authenticated.')
  const { data, error } = await admin.auth.getUser(accessToken)
  if (error || !data.user) throw new Error('Invalid or expired session.')
  return { admin, user: data.user }
}

/** Finds an existing Stripe customer id for the user, or creates one and stores it. */
async function ensureCustomer(
  stripe: Stripe,
  admin: ReturnType<typeof getAdminClient>,
  userId: string,
  email: string | undefined,
): Promise<string> {
  if (!admin) throw new Error('Supabase admin unavailable.')
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (profile?.stripe_customer_id) return profile.stripe_customer_id as string

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_id: userId },
  })
  await admin.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', userId)
  return customer.id
}

/** Creates a Checkout Session for the Pro plan; returns the hosted checkout URL. */
export async function createCheckout(env: Env, accessToken?: string): Promise<{ url: string }> {
  const stripe = getStripe(env)
  if (!stripe) throw new Error('Stripe is not configured on the server.')
  if (!env.STRIPE_PRICE_PRO) throw new Error('STRIPE_PRICE_PRO is not set.')

  const { admin, user } = await getUserFromToken(env, accessToken)
  const customerId = await ensureCustomer(stripe, admin, user.id, user.email)
  const appUrl = env.APP_URL || 'http://localhost:5173'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: env.STRIPE_PRICE_PRO, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
  })
  if (!session.url) throw new Error('Stripe did not return a checkout URL.')
  return { url: session.url }
}

/** Creates a Billing Portal session so the user can manage/cancel their subscription. */
export async function createPortal(env: Env, accessToken?: string): Promise<{ url: string }> {
  const stripe = getStripe(env)
  if (!stripe) throw new Error('Stripe is not configured on the server.')

  const { admin, user } = await getUserFromToken(env, accessToken)
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()
  if (!profile?.stripe_customer_id) throw new Error('No billing account yet — subscribe first.')

  const appUrl = env.APP_URL || 'http://localhost:5173'
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id as string,
    return_url: `${appUrl}/dashboard`,
  })
  return { url: session.url }
}

/** Verifies a webhook and syncs subscription state into the profiles table. */
export async function handleWebhook(
  env: Env,
  rawBody: string | Buffer,
  signature: string | undefined,
): Promise<{ received: true }> {
  const stripe = getStripe(env)
  if (!stripe) throw new Error('Stripe is not configured on the server.')
  if (!env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is not set.')
  if (!signature) throw new Error('Missing stripe-signature header.')

  const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
  const admin = getAdminClient(env)
  if (!admin) throw new Error('Supabase admin unavailable.')

  async function syncByCustomer(customerId: string, sub: Stripe.Subscription) {
    const periodEnd = sub.items.data[0]?.current_period_end
    await admin!
      .from('profiles')
      .update({
        subscription_status: sub.status,
        subscription_tier: sub.status === 'active' || sub.status === 'trialing' ? 'pro' : 'starter',
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      })
      .eq('stripe_customer_id', customerId)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.subscription && session.customer) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        await syncByCustomer(session.customer as string, sub)
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await syncByCustomer(sub.customer as string, sub)
      break
    }
    default:
      break
  }
  return { received: true }
}
