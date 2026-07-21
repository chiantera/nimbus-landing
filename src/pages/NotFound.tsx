import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="page-hero-blur" />
      <div className="notfound-code">404</div>
      <h1>Well, this is awkward.</h1>
      <p className="page-hero-sub">The page you’re looking for floated off into the cloud.</p>
      <Link to="/" className="btn btn-pill btn-lg">
        Take me home
      </Link>
    </section>
  )
}
