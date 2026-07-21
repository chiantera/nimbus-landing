# Nimbus

A (gleefully) late-2010s SaaS landing site — big gradient hero, floating cards, animated
counters, and a working **AI assistant** backed by a provider-agnostic serverless proxy.

Built with **Vite + React + TypeScript** and **React Router**.

## Pages

- `/` — landing (hero, features teaser, stats, testimonial, CTA)
- `/features` — full feature grid + "how it works"
- `/pricing` — pricing tiers + FAQ
- `/blog` and `/blog/:slug` — blog index + posts
- `*` — 404

## Local development

```bash
npm install
npm run dev
```

The site runs at http://localhost:5173.

### Wiring up the AI assistant (chat bubble)

The chat widget calls `POST /api/chat`. In dev, a small Vite middleware serves that
endpoint using your key from a **gitignored `.env`** — the key never ships to the browser.

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Fill in **one** provider (all are OpenAI-compatible):

   | Provider | `AI_BASE_URL` | `AI_MODEL` |
   |----------|---------------|-----------|
   | DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
   | Mistral  | `https://api.mistral.ai/v1` | `mistral-small-latest` |
   | GLM/Zhipu| `https://api.z.ai/api/paas/v4` | `glm-4-flash` |

   …plus your `AI_API_KEY`.
3. Restart `npm run dev`. The assistant is now live.

## Deployment

### Vercel (recommended — serves the site **and** the AI function)

The API key can only live on a host that runs server code. GitHub Pages is static, so the
assistant needs a real backend. Vercel does both:

1. Push this repo to GitHub (already done).
2. In Vercel: **New Project → import this repo** (framework preset: Vite).
3. Add Environment Variables: `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`.
4. Deploy. `api/chat.ts` becomes the serverless proxy automatically; `vercel.json`
   handles SPA routing.

### GitHub Pages (static mirror — no AI)

`.github/workflows/deploy.yml` builds with `DEPLOY_TARGET=ghpages` (base `/nimbus-landing/`)
and deploys on every push to `main`. The marketing site works fully; the chat bubble will
show a friendly "backend not configured" message since Pages can't run the function.

Live: https://chiantera.github.io/nimbus-landing/

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Dev server + local `/api/chat` proxy |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |
