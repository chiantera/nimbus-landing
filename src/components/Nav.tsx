import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname])

  // Solid on inner pages always; on the home page only once scrolled past the hero.
  const solid = !isHome || scrolled

  return (
    <nav className={`nav${solid ? ' nav--solid' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">◎</span> Nimbus
        </Link>
        <button className="hamburger" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <a href="#login" className="nav-login">Log in</a>
          <Link to="/pricing" className="btn btn-pill btn-sm">Get started free</Link>
        </div>
      </div>
    </nav>
  )
}
