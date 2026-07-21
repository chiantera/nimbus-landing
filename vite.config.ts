import { defineConfig, loadEnv } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { getConfigFromEnv, runChat, type ChatMessage } from './server/chatHandler.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load every var from .env (not just VITE_*) so the dev proxy can read the key.
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
        // Dev-only: mirrors the production /api/chat serverless function so the
        // assistant works with `npm run dev` using the key from .env.
        name: 'dev-api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req: IncomingMessage, res: ServerResponse) => {
            const send = (code: number, body: unknown) => {
              res.statusCode = code
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(body))
            }
            if (req.method !== 'POST') return send(405, { error: 'Method not allowed' })

            const config = getConfigFromEnv(env)
            if (!config) {
              return send(503, {
                error:
                  'AI backend not configured. Copy .env.example to .env and set AI_BASE_URL, AI_API_KEY, AI_MODEL, then restart the dev server.',
              })
            }

            try {
              const raw = await readBody(req)
              const body = raw ? (JSON.parse(raw) as { messages?: ChatMessage[] }) : {}
              const reply = await runChat(config, body.messages ?? [])
              send(200, { reply })
            } catch (err) {
              send(500, { error: err instanceof Error ? err.message : 'Unexpected error' })
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
