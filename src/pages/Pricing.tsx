import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../lib/ui'
import { tiers, faqs } from '../data'

export default function Pricing() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-blur" />
        <Reveal>
          <span className="pill-badge">💸 Pricing</span>
          <h1>Simple, honest pricing</h1>
          <p className="page-hero-sub">Start free. Upgrade when you’re ready. Cancel anytime.</p>
        </Reveal>
      </section>

      <section className="section pricing-section">
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
                    <>
                      <span className="price-cur">$</span>
                      <span className="price-amt">{t.price}</span>
                      <span className="price-per">/mo</span>
                    </>
                  )}
                </div>
                <ul className="price-features">
                  {t.features.map((pf) => (
                    <li key={pf}>✓ {pf}</li>
                  ))}
                </ul>
                <Link to="/pricing" className={`btn btn-pill btn-block${t.featured ? '' : ' btn-outline'}`}>
                  {t.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section faq-section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>Questions, answered</h2>
          </div>
        </Reveal>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <button
                className={`faq-item${open === i ? ' open' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="faq-q">
                  {f.q}
                  <span className="faq-chevron">⌄</span>
                </span>
                <span className="faq-a">{f.a}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
