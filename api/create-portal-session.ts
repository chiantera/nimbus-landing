// POST /api/create-portal-session — returns { url } for the Stripe billing portal.
// Requires an Authorization: Bearer <supabase access token> header.
import { createPortal } from '../server/billing.ts'

interface Req {
  method?: string
  headers?: Record<string, string | string[] | undefined>
}
interface Res {
  status: (code: number) => { json: (body: unknown) => void }
}

function bearer(headers?: Req['headers']): string | undefined {
  const raw = headers?.authorization ?? headers?.Authorization
  const value = Array.isArray(raw) ? raw[0] : raw
  return value?.replace(/^Bearer\s+/i, '')
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const out = await createPortal(process.env, bearer(req.headers))
    res.status(200).json(out)
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Unexpected error' })
  }
}
