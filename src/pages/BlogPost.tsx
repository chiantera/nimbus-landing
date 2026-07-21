import { Link, useParams } from 'react-router-dom'
import { Reveal } from '../lib/ui'
import { posts } from '../data'

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <section className="page-hero">
        <h1>Post not found 🤔</h1>
        <p className="page-hero-sub">That article seems to have wandered off.</p>
        <Link to="/blog" className="btn btn-pill btn-outline">
          ← Back to blog
        </Link>
      </section>
    )
  }

  return (
    <article className="post">
      <div className="post-hero">
        <div className="page-hero-blur" />
        <Reveal>
          <div className="post-emoji">{post.emoji}</div>
          <div className="blog-meta">
            {post.date} · {post.readTime}
          </div>
          <h1>{post.title}</h1>
        </Reveal>
      </div>
      <div className="post-body">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <Link to="/blog" className="btn btn-pill btn-outline post-back">
          ← Back to all posts
        </Link>
      </div>
    </article>
  )
}
