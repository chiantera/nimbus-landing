import { useEffect, useRef, useState } from 'react'
import './App.css'

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return value
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal${shown ? ' is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const features = [
  { emoji: '⚡️', title: 'Lightning workflows', body: 'Automate the busywork with drag-and-drop flows your whole team actually gets.' },
  { emoji: '🎯', title: 'Focus mode', body: 'One dashboard. Zero noise. See exactly what needs you — and nothing else.' },
  { emoji: '🔒', title: 'Enterprise-grade security', body: 'SOC 2, SSO, and end-to-end encryption baked in from day one.' },
  { emoji: '📊', title: 'Insights that slap', body: 'Real-time analytics that turn gut feelings into decisions you can defend.' },
  { emoji: '🤝', title: 'Plays nice', body: '120+ integrations. Slack, Figma, GitHub, your CRM — Nimbus speaks their language.' },
  { emoji: '🌈', title: 'Delightfully simple', body: 'Onboarded in minutes, not months. Your intern could run it. Really.' },
]

const stats = [
  { target: 12000, suffix: '+', label: 'Teams onboarded' },
  { target: 99, suffix: '.9%', label: 'Uptime, guaranteed' },
  { target: 4, suffix: '.9★', label: 'Average rating' },
  { target: 40, suffix: 'M', label: 'Tasks automated' },
]

const tiers = [
  { name: 'Starter', price: '0', tagline: 'For side-projects & solo hustlers', features: ['Up to 3 projects', '1 seat', 'Community support', 'Core integrations'], cta: 'Start free', featured: false },
  { name: 'Pro', price: '19', tagline: 'For teams ready to ship faster', features: ['Unlimited projects', 'Up to 20 seats', 'Priority support', 'Advanced analytics', 'SSO & audit logs'], cta: 'Start 14-day trial', featured: true },
  { name: 'Enterprise', price: 'Custom', tagline: 'For orgs that need it all', features: ['Everything in Pro', 'Unlimited seats', 'Dedicated CSM', 'Custom SLAs', 'On-prem option'], cta: 'Contact sales', featured: false },
]

function Stat({ target, suffix, label, active }: { target: number; suffix: string; label: string; active: boolean }) {
  const v = useCountUp(target, active)
  const display = target >= 1000 ? v.toLocaleString() : v
  return (
    <div className="stat">
      <div className="stat-num">{display}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function StatsBand() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setActive(true)
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div className="stats" ref={ref}>
      {stats.map((s) => (
        <Stat key={s.label} {...s} active={active} />
      ))}
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--solid' : ''}`}>
        <div className="nav-inner">
          <a href="#top" className="logo">
            <span className="logo-mark">◎</span> Nimbus
          </a>
          <button className="hamburger" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            <span /><span /><span />
          </button>
          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#stats" onClick={() => setMenuOpen(false)}>Why Nimbus</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#login" className="nav-login" onClick={() => setMenuOpen(false)}>Log in</a>
            <a href="#signup" className="btn btn-pill btn-sm" onClick={() => setMenuOpen(false)}>Get started free</a>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero-blur hero-blur-1" />
        <div className="hero-blur hero-blur-2" />
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="pill-badge">🚀 Now with AI-powered flows</span>
            <h1>Work, reimagined<br />for actual humans.</h1>
            <p className="hero-sub">
              Nimbus is the all-in-one workspace that helps modern teams do more of what
              they love — and automate the rest. No clutter. No chaos. Just flow.
            </p>
            <div className="hero-actions">
              <a href="#signup" className="btn btn-pill btn-lg">Get started — it’s free</a>
              <a href="#demo" className="btn btn-ghost btn-lg">▶ Watch demo</a>
            </div>
            <div className="hero-trust">
              <span>Trusted by teams at</span>
              <div className="logos">
                <b>Loopwork</b><b>Vertex</b><b>Muno</b><b>Foldr</b><b>Aria</b>
              </div>
            </div>
          </div>
          <div className="hero-mock">
            <div className="browser">
              <div className="browser-bar">
                <i /><i /><i />
                <span className="browser-url">app.nimbus.io/dashboard</span>
              </div>
              <div className="browser-body">
                <div className="mock-side">
                  <span className="mock-avatar" />
                  <span className="mock-line" /><span className="mock-line short" />
                  <span className="mock-line" /><span className="mock-line short" />
                  <span className="mock-line" />
                </div>
                <div className="mock-main">
                  <div className="mock-card mock-card-grad">
                    <span className="mock-line light" /><span className="mock-line light short" />
                  </div>
                  <div className="mock-row">
                    <div className="mock-card"><span className="mock-dot" /><span className="mock-line" /></div>
                    <div className="mock-card"><span className="mock-dot pink" /><span className="mock-line" /></div>
                  </div>
                  <div className="mock-card"><span className="mock-line" /><span className="mock-line short" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section" id="features">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Features</span>
            <h2>Everything you need.<br />Nothing you don’t.</h2>
            <p className="section-sub">A thoughtfully-designed toolkit that grows with your team.</p>
          </div>
        </Reveal>
        <div className="feature-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="feature-card">
                <div className="feature-emoji">{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band" id="stats">
        <StatsBand />
      </section>

      <section className="section testimonial-section">
        <Reveal>
          <div className="testimonial">
            <div className="quote-mark">“</div>
            <p className="quote">
              We switched our entire ops team to Nimbus in a weekend. Two weeks later
              nobody could remember how we worked before. It just <em>clicks</em>.
            </p>
            <div className="quote-author">
              <span className="quote-avatar">JR</span>
              <div>
                <strong>Jordan Rivera</strong>
                <span>Head of Ops, Loopwork</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section" id="pricing">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2>Simple, honest pricing</h2>
            <p className="section-sub">Start free. Upgrade when you’re ready. Cancel anytime.</p>
          </div>
        </Reveal>
        <div className="pricing-grid">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className={`price-card${t.featured ? ' price-card--featured' : ''}`}>
                {t.featured && <span className="price-badge">Most popular</span>}
                <h3>{t.name}</h3>
                <p className="price-tagline">{t.tagline}</p>
                <div className="price">
                  {t.price === 'Custom' ? (
                    <span className="price-custom">Custom</span>
                  ) : (
                    <><span className="price-cur">$</span><span className="price-amt">{t.price}</span><span className="price-per">/mo</span></>
                  )}
                </div>
                <ul className="price-features">
                  {t.features.map((pf) => (
                    <li key={pf}>✓ {pf}</li>
                  ))}
                </ul>
                <a href="#signup" className={`btn btn-pill btn-block${t.featured ? '' : ' btn-outline'}`}>{t.cta}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cta-band" id="signup">
        <div className="cta-blur" />
        <Reveal>
          <div className="cta-inner">
            <h2>Ready to find your flow?</h2>
            <p>Join 12,000+ teams already working smarter with Nimbus. No credit card required.</p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@company.com" aria-label="Email" />
              <button type="submit" className="btn btn-pill btn-lg">Get started free</button>
            </form>
          </div>
        </Reveal>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#top" className="logo"><span className="logo-mark">◎</span> Nimbus</a>
            <p>Work, reimagined for actual humans.</p>
            <div className="socials">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Instagram">◍</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Dribbble">●</a>
            </div>
          </div>
          <div className="footer-cols">
            <div><h4>Product</h4><a href="#">Features</a><a href="#">Integrations</a><a href="#">Pricing</a><a href="#">Changelog</a></div>
            <div><h4>Company</h4><a href="#">About</a><a href="#">Careers</a><a href="#">Blog</a><a href="#">Press</a></div>
            <div><h4>Resources</h4><a href="#">Docs</a><a href="#">Help center</a><a href="#">Community</a><a href="#">Status</a></div>
            <div><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a><a href="#">GDPR</a></div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2019 Nimbus, Inc. Made with 💜 and too much cold brew.</span>
          <span>Designed like it’s peak 2010s.</span>
        </div>
      </footer>

      <button className="chat-bubble" aria-label="Chat with us">💬</button>
    </>
  )
}
