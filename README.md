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

## Accounts & billing (Supabase + Stripe)

Auth and subscriptions are real. Supabase handles login; Stripe handles payments;
Vercel serverless functions in `api/` are the backend (the key never reaches the browser).

- **Supabase project:** `nimbus` (ref `fvjzvayvebhewmpwhlio`, org `sapienza.dev`). The
  `profiles` table is auto-created per user via a trigger and protected by Row-Level
  Security. Billing columns are written only by the Stripe webhook (service role).
- **Client env (safe):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- **Server env (secret — Vercel env vars, never committed):**
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO`, `APP_URL`.

### Stripe setup

1. Create a Stripe account; in **test mode**, add a Product with a recurring **$19/mo**
   Price → copy its `price_…` id into `STRIPE_PRICE_PRO`.
2. Copy your test **secret key** (`sk_test_…`) into `STRIPE_SECRET_KEY`.
3. Add a webhook endpoint → `https://<your-app>/api/stripe-webhook`, listening for
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   Copy the signing secret (`whsec_…`) into `STRIPE_WEBHOOK_SECRET`.
4. Locally, forward webhooks with the Stripe CLI: `stripe listen --forward-to localhost:5173/api/stripe-webhook`.

### API routes (Vercel functions in `api/`)

| Route | Purpose |
|-------|---------|
| `POST /api/create-checkout-session` | Starts Stripe Checkout for the signed-in user |
| `POST /api/create-portal-session` | Opens the Stripe billing portal |
| `POST /api/stripe-webhook` | Verifies the signature, syncs subscription → Supabase |
| `POST /api/chat` | AI assistant proxy |

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
