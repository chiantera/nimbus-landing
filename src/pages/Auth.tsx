import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const { ready, signInWithPassword, signUp, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isSignup = mode === 'signup'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)
    try {
      if (isSignup) {
        const { error, needsConfirmation } = await signUp(email, password, fullName)
        if (error) return setError(error)
        if (needsConfirmation) {
          return setNotice('Check your inbox to confirm your email, then log in.')
        }
        navigate('/dashboard')
      } else {
        const { error } = await signInWithPassword(email, password)
        if (error) return setError(error)
        navigate('/dashboard')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="page-hero-blur" />
      <div className="auth-card">
        <Link to="/" className="logo auth-logo">
          <span className="logo-mark">◎</span> Nimbus
        </Link>
        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-sub">
          {isSignup ? 'Start your free workspace in seconds.' : 'Log in to your Nimbus workspace.'}
        </p>

        {!ready && (
          <div className="auth-warn">
            Supabase isn’t configured yet. Add your keys to <code>.env</code> to enable accounts.
          </div>
        )}

        <div className="oauth-row">
          <button className="btn btn-oauth" onClick={() => signInWithOAuth('google')} disabled={!ready || busy}>
            <span>G</span> Continue with Google
          </button>
          <button className="btn btn-oauth" onClick={() => signInWithOAuth('github')} disabled={!ready || busy}>
            <span>⌥</span> Continue with GitHub
          </button>
        </div>

        <div className="auth-divider"><span>or</span></div>

        <form className="auth-form" onSubmit={onSubmit}>
          {isSignup && (
            <label>
              Full name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ada Lovelace" required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
          </label>

          {error && <div className="auth-error">{error}</div>}
          {notice && <div className="auth-notice">{notice}</div>}

          <button type="submit" className="btn btn-pill btn-block btn-lg" disabled={!ready || busy}>
            {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? (
            <>Already have an account? <Link to="/login">Log in</Link></>
          ) : (
            <>New to Nimbus? <Link to="/signup">Create an account</Link></>
          )}
        </p>
      </div>
    </section>
  )
}
