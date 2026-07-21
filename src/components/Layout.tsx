import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'

export default function Layout() {
  const { pathname } = useLocation()

  // Jump to top on every route change.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
