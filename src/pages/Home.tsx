import { Link } from 'react-router-dom'
import { Reveal, StatsBand } from '../lib/ui'
import { features } from '../data'

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="hero-blur hero-blur-1" />
        <div className="hero-blur hero-blur-2" />
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="pill-badge">🚀 Now with AI-powered flows</span>
            <h1>
              Work, reimagined
              <br />
              for actual humans.
            </h1>
            <p className="hero-sub">
              Nimbus is the all-in-one workspace that helps modern teams do more of what they love —
              and automate the rest. No clutter. No chaos. Just flow.
            </p>
            <div className="hero-actions">
              <Link to="/pricing" className="btn btn-pill btn-lg">
                Get started — it’s free
              </Link>
              <a href="#demo" className="btn btn-ghost btn-lg">
                ▶ Watch demo
              </a>
            </div>
            <div className="hero-trust">
              <span>Trusted by teams at</span>
              <div className="logos">
                <b>Loopwork</b>
                <b>Vertex</b>
                <b>Muno</b>
                <b>Foldr</b>
                <b>Aria</b>
              </div>
            </div>
          </div>
          <div className="hero-mock">
            <div className="browser">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span className="browser-url">app.nimbus.io/dashboard</span>
              </div>
              <div className="browser-body">
                <div className="mock-side">
                  <span className="mock-avatar" />
                  <span className="mock-line" />
                  <span className="mock-line short" />
                  <span className="mock-line" />
                  <span className="mock-line short" />
                  <span className="mock-line" />
                </div>
                <div className="mock-main">
                  <div className="mock-card mock-card-grad">
                    <span className="mock-line light" />
                    <span className="mock-line light short" />
                  </div>
                  <div className="mock-row">
                    <div className="mock-card">
                      <span className="mock-dot" />
                      <span className="mock-line" />
                    </div>
                    <div className="mock-card">
                      <span className="mock-dot pink" />
                      <span className="mock-line" />
                    </div>
                  </div>
                  <div className="mock-card">
                    <span className="mock-line" />
                    <span className="mock-line short" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Features</span>
            <h2>
              Everything you need.
              <br />
              Nothing you don’t.
            </h2>
            <p className="section-sub">A thoughtfully-designed toolkit that grows with your team.</p>
          </div>
        </Reveal>
        <div className="feature-grid">
          {features.slice(0, 3).map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="feature-card">
                <div className="feature-emoji">{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="center-cta">
          <Link to="/features" className="btn btn-pill btn-outline">
            See all features →
          </Link>
        </div>
      </section>

      <StatsBand />

      <section className="section testimonial-section">
        <Reveal>
          <div className="testimonial">
            <div className="quote-mark">“</div>
            <p className="quote">
              We switched our entire ops team to Nimbus in a weekend. Two weeks later nobody could
              remember how we worked before. It just <em>clicks</em>.
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

      <CtaBand />
    </>
  )
}

export function CtaBand() {
  return (
    <section className="cta-band" id="signup">
      <div className="cta-blur" />
      <Reveal>
        <div className="cta-inner">
          <h2>Ready to find your flow?</h2>
          <p>Join 12,000+ teams already working smarter with Nimbus. No credit card required.</p>
          <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@company.com" aria-label="Email" />
            <button type="submit" className="btn btn-pill btn-lg">
              Get started free
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  )
}
