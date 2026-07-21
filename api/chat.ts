// Vercel serverless function: POST /api/chat
// Holds the API key server-side (set AI_BASE_URL / AI_API_KEY / AI_MODEL as
// Environment Variables in the Vercel dashboard). The browser never sees it.
import { getConfigFromEnv, runChat, type ChatMessage } from '../server/chatHandler'

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void }
  },
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const config = getConfigFromEnv(process.env)
  if (!config) {
    res.status(503).json({
      error:
        'AI backend is not configured. Set AI_BASE_URL, AI_API_KEY and AI_MODEL in your host environment.',
    })
    return
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
      messages?: ChatMessage[]
    }
    const reply = await runChat(config, body?.messages ?? [])
    res.status(200).json({ reply })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unexpected error' })
  }
}
