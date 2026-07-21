import { Link } from 'react-router-dom'
import { Reveal } from '../lib/ui'
import { posts } from '../data'

export default function Blog() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-blur" />
        <Reveal>
          <span className="pill-badge">📝 Blog</span>
          <h1>The Nimbus journal</h1>
          <p className="page-hero-sub">Notes on building calmer software, automation that doesn’t suck, and the occasional gradient manifesto.</p>
        </Reveal>
      </section>

      <section className="section">
        <div className="blog-grid">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link to={`/blog/${p.slug}`} className="blog-card">
                <div className="blog-emoji">{p.emoji}</div>
                <div className="blog-meta">
                  {p.date} · {p.readTime}
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="blog-more">Read more →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
