import { Reveal } from '../lib/ui'
import { features, steps } from '../data'
import { CtaBand } from './Home'

export default function Features() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-blur" />
        <Reveal>
          <span className="pill-badge">✨ Features</span>
          <h1>One workspace. Endless flow.</h1>
          <p className="page-hero-sub">
            Everything your team needs to connect its tools, automate the busywork, and stay in the
            zone — without the seventeen-tab circus.
          </p>
        </Reveal>
      </section>

      <section className="section">
        <div className="feature-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="feature-card">
                <div className="feature-emoji">{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section steps-section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Up and running in minutes</h2>
            <p className="section-sub">No onboarding marathon. No consultants. Just three steps.</p>
          </div>
        </Reveal>
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="step">
                <span className="step-n">{s.n}</span>
                <div className="step-emoji">{s.emoji}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
