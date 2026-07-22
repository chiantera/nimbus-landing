import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../lib/auth'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, session, ready } = useAuth()

  if (!ready) {
    return (
      <section className="page-hero">
        <h1>Auth not configured</h1>
        <p className="page-hero-sub">
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable accounts.
        </p>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="auth-loading">
        <div className="spinner" />
      </section>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}
