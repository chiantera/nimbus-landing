import { defineConfig, loadEnv } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { getConfigFromEnv, runChat, type ChatMessage } from './server/chatHandler.ts'
import { createCheckout, createPortal, handleWebhook } from './server/billing.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load every var from .env (not just VITE_*) so the dev API can read secrets.
  const env = loadEnv(mode, process.cwd(), '')

  // GitHub Pages serves from /nimbus-landing/; Vercel (and local dev) from /.
  const base = process.env.DEPLOY_TARGET === 'ghpages' ? '/nimbus-landing/' : '/'

  return {
    base,
    // Ensure a single React instance across the app and pre-bundled deps
    // (react-router-dom), otherwise hooks can hit a second copy of React.
    resolve: { dedupe: ['react', 'react-dom'] },
    plugins: [
      react(),
      {
        // Dev-only: mirrors the production /api/* serverless functions so the
        // full auth + billing + AI flow works under `npm run dev` using .env.
        name: 'dev-api',
        configureServer(server) {
          const json = (res: ServerResponse, code: number, body: unknown) => {
            res.statusCode = code
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }
          const bearer = (req: IncomingMessage) => {
            const raw = req.headers['authorization']
            const value = Array.isArray(raw) ? raw[0] : raw
            return value?.replace(/^Bearer\s+/i, '')
          }

          server.middlewares.use('/api/chat', async (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
            const config = getConfigFromEnv(env)
            if (!config) {
              return json(res, 503, {
                error:
                  'AI backend not configured. Set AI_BASE_URL, AI_API_KEY, AI_MODEL in .env and restart.',
              })
            }
            try {
              const raw = await readBody(req)
              const body = raw ? (JSON.parse(raw) as { messages?: ChatMessage[] }) : {}
              json(res, 200, { reply: await runChat(config, body.messages ?? []) })
            } catch (err) {
              json(res, 500, { error: err instanceof Error ? err.message : 'Unexpected error' })
            }
          })

          server.middlewares.use('/api/create-checkout-session', async (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
            try {
              json(res, 200, await createCheckout(env, bearer(req)))
            } catch (err) {
              json(res, 400, { error: err instanceof Error ? err.message : 'Unexpected error' })
            }
          })

          server.middlewares.use('/api/create-portal-session', async (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
            try {
              json(res, 200, await createPortal(env, bearer(req)))
            } catch (err) {
              json(res, 400, { error: err instanceof Error ? err.message : 'Unexpected error' })
            }
          })

          server.middlewares.use('/api/stripe-webhook', async (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
            try {
              const raw = await readBody(req)
              const sig = req.headers['stripe-signature']
              json(res, 200, await handleWebhook(env, raw, Array.isArray(sig) ? sig[0] : sig))
            } catch (err) {
              json(res, 400, { error: err instanceof Error ? err.message : 'Webhook error' })
            }
          })
        },
      },
    ],
  }
})

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}
