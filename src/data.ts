export interface Feature {
  emoji: string
  title: string
  body: string
}

export interface Stat {
  target: number
  suffix: string
  label: string
}

export interface Tier {
  name: string
  price: string
  tagline: string
  features: string[]
  cta: string
  featured: boolean
}

export interface Post {
  slug: string
  title: string
  date: string
  readTime: string
  emoji: string
  excerpt: string
  body: string[]
}

export const features: Feature[] = [
  { emoji: '⚡️', title: 'Lightning workflows', body: 'Automate the busywork with drag-and-drop flows your whole team actually gets.' },
  { emoji: '🎯', title: 'Focus mode', body: 'One dashboard. Zero noise. See exactly what needs you — and nothing else.' },
  { emoji: '🔒', title: 'Enterprise-grade security', body: 'SOC 2, SSO, and end-to-end encryption baked in from day one.' },
  { emoji: '📊', title: 'Insights that slap', body: 'Real-time analytics that turn gut feelings into decisions you can defend.' },
  { emoji: '🤝', title: 'Plays nice', body: '120+ integrations. Slack, Figma, GitHub, your CRM — Nimbus speaks their language.' },
  { emoji: '🌈', title: 'Delightfully simple', body: 'Onboarded in minutes, not months. Your intern could run it. Really.' },
]

export const stats: Stat[] = [
  { target: 12000, suffix: '+', label: 'Teams onboarded' },
  { target: 99, suffix: '.9%', label: 'Uptime, guaranteed' },
  { target: 4, suffix: '.9★', label: 'Average rating' },
  { target: 40, suffix: 'M', label: 'Tasks automated' },
]

export const tiers: Tier[] = [
  { name: 'Starter', price: '0', tagline: 'For side-projects & solo hustlers', features: ['Up to 3 projects', '1 seat', 'Community support', 'Core integrations'], cta: 'Start free', featured: false },
  { name: 'Pro', price: '19', tagline: 'For teams ready to ship faster', features: ['Unlimited projects', 'Up to 20 seats', 'Priority support', 'Advanced analytics', 'SSO & audit logs'], cta: 'Start 14-day trial', featured: true },
  { name: 'Enterprise', price: 'Custom', tagline: 'For orgs that need it all', features: ['Everything in Pro', 'Unlimited seats', 'Dedicated CSM', 'Custom SLAs', 'On-prem option'], cta: 'Contact sales', featured: false },
]

export const steps = [
  { n: '01', emoji: '🔗', title: 'Connect your tools', body: 'Plug in Slack, GitHub, your CRM and 120+ more in a couple of clicks.' },
  { n: '02', emoji: '🧩', title: 'Build a flow', body: 'Drag, drop, done. Turn any repetitive process into an automated flow.' },
  { n: '03', emoji: '🚀', title: 'Watch it run', body: 'Nimbus handles the busywork while your team does the work that matters.' },
]

export const faqs = [
  { q: 'Can I change plans later?', a: 'Absolutely. Upgrade, downgrade, or cancel anytime from your billing settings — changes are prorated automatically.' },
  { q: 'Is there a free trial on Pro?', a: 'Yes — every Pro plan starts with a 14-day free trial. No credit card required to begin.' },
  { q: 'How does billing work for seats?', a: 'You’re billed per active seat, per month. Add or remove teammates whenever you like and we’ll adjust the invoice.' },
  { q: 'Do you offer discounts for nonprofits?', a: 'We do — nonprofits and eligible startups get 50% off any paid plan. Reach out to sales to get set up.' },
]

export const posts: Post[] = [
  {
    slug: 'why-we-built-nimbus',
    title: 'Why we built Nimbus',
    date: 'Jun 12, 2019',
    readTime: '4 min read',
    emoji: '💡',
    excerpt: 'Every team we talked to was drowning in tools. So we built the one that ties them all together.',
    body: [
      'A few years ago we counted the apps our old team touched in a single day. It was seventeen. Seventeen tabs, seventeen logins, seventeen little notification badges quietly demanding attention.',
      'None of them talked to each other. Context lived in someone’s head, a Slack thread, and three different spreadsheets. We spent more time managing the work than doing it.',
      'Nimbus is our answer: one calm surface where your tools, your tasks, and your team finally share a brain. Connect what you already use, automate the parts nobody enjoys, and get your afternoons back.',
    ],
  },
  {
    slug: 'automation-that-doesnt-suck',
    title: 'Automation that doesn’t suck',
    date: 'Jul 03, 2019',
    readTime: '6 min read',
    emoji: '⚙️',
    excerpt: 'Most automation tools make you think like a machine. We think that’s backwards.',
    body: [
      'The dirty secret of most automation software is that you have to become a part-time engineer to use it. Triggers, filters, payloads, webhooks — it’s a second job.',
      'We designed Nimbus flows to read like sentences. “When a deal is marked won, create an onboarding project and ping the CS channel.” That’s the whole thing. No code, no cron syntax, no crying.',
      'The result: teams ship their first useful automation in under ten minutes, and actually build more of them because it never feels like a chore.',
    ],
  },
  {
    slug: 'the-2010s-web-aesthetic',
    title: 'In defense of the big gradient hero',
    date: 'Jul 18, 2019',
    readTime: '3 min read',
    emoji: '🌈',
    excerpt: 'Yes, our homepage has a giant purple-to-pink gradient. No, we will not be apologizing.',
    body: [
      'There’s a certain look to late-2010s software: bold sans-serif headings, generous whitespace, a hero gradient you could see from space, and a friendly little chat bubble in the corner.',
      'People call it dated. We call it optimistic. It was a moment when software decided to be warm and human instead of gray and corporate.',
      'So we leaned in. Big gradient, ghost buttons, floating cards, an emoji or nine. If it makes you smile before you’ve even signed up, we did our job.',
    ],
  },
]
