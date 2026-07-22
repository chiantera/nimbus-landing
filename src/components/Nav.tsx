import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { session, signOut } = useAuth()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const solid = !isHome || scrolled

  async function onSignOut() {
    await signOut()
    navigate('/')
  }

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
          {session ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <button className="btn btn-pill btn-sm" onClick={onSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Log in</Link>
              <Link to="/signup" className="btn btn-pill btn-sm">Get started free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
