// POST /api/stripe-webhook — verifies the Stripe signature and syncs the
// subscription into Supabase. Needs the RAW request body, so body parsing is off.
import type { IncomingMessage } from 'node:http'
import { handleWebhook } from '../server/billing.ts'

export const config = { api: { bodyParser: false } }

interface Res {
  status: (code: number) => { json: (body: unknown) => void; send: (body: string) => void }
}
type Req = IncomingMessage & { body?: unknown; headers: Record<string, string | string[] | undefined> }

function readRaw(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Prefer an already-buffered body; otherwise read the stream.
  let raw: Buffer | string
  if (Buffer.isBuffer(req.body)) raw = req.body
  else if (typeof req.body === 'string') raw = req.body
  else raw = await readRaw(req)

  const sigHeader = req.headers['stripe-signature']
  const signature = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader

  try {
    const out = await handleWebhook(process.env, raw, signature)
    res.status(200).json(out)
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Webhook error' })
  }
}
