import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { startCheckout, openBillingPortal } from '../lib/billing'

export default function Dashboard() {
  const { user, profile, isPro, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const justCheckedOut = params.get('checkout') === 'success'

  // After returning from Stripe, poll the profile a couple times while the
  // webhook lands, then clear the query param.
  useEffect(() => {
    if (!justCheckedOut) return
    let n = 0
    const id = setInterval(async () => {
      await refreshProfile()
      if (++n >= 4) {
        clearInterval(id)
        setParams({}, { replace: true })
      }
    }, 1500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justCheckedOut])

  const name = profile?.full_name || user?.email?.split('@')[0] || 'there'

  async function onUpgrade() {
    setError(null)
    setBusy(true)
    try {
      await startCheckout()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start checkout')
      setBusy(false)
    }
  }

  async function onManage() {
    setError(null)
    setBusy(true)
    try {
      await openBillingPortal()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open billing portal')
      setBusy(false)
    }
  }

  async function onSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <section className="dashboard">
      <div className="dash-topbar">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Hey, {name} 👋</h1>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onSignOut}>Sign out</button>
      </div>

      {justCheckedOut && (
        <div className="dash-banner success">🎉 Payment received — welcome to Pro! Syncing your subscription…</div>
      )}
      {error && <div className="dash-banner error">{error}</div>}

      <div className="dash-grid">
        <div className={`dash-card plan-card${isPro ? ' plan-pro' : ''}`}>
          <span className="plan-badge-lg">{isPro ? 'PRO' : 'STARTER'}</span>
          <h3>Your plan</h3>
          <p className="plan-status">
            Status: <strong>{profile?.subscription_status ?? 'inactive'}</strong>
          </p>
          {profile?.current_period_end && (
            <p className="plan-renew">
              Renews {new Date(profile.current_period_end).toLocaleDateString()}
            </p>
          )}
          {isPro ? (
            <button className="btn btn-pill btn-block" onClick={onManage} disabled={busy}>
              {busy ? 'Opening…' : 'Manage billing'}
            </button>
          ) : (
            <button className="btn btn-pill btn-block" onClick={onUpgrade} disabled={busy}>
              {busy ? 'Starting…' : 'Upgrade to Pro — $19/mo'}
            </button>
          )}
        </div>

        <div className="dash-card">
          <h3>Account</h3>
          <dl className="dash-dl">
            <dt>Email</dt>
            <dd>{user?.email}</dd>
            <dt>Name</dt>
            <dd>{profile?.full_name || '—'}</dd>
            <dt>User ID</dt>
            <dd className="mono">{user?.id?.slice(0, 8)}…</dd>
          </dl>
        </div>

        <div className="dash-card dash-wide">
          <h3>Workspace</h3>
          <p className="dash-muted">
            {isPro
              ? 'You’ve got the full Nimbus toolkit — unlimited projects, advanced analytics, and priority support. Time to build a flow.'
              : 'You’re on the free Starter plan. Upgrade to Pro to unlock unlimited projects, analytics, and SSO.'}
          </p>
          <div className="dash-tiles">
            <div className="dash-tile"><span>⚡️</span>Flows</div>
            <div className="dash-tile"><span>📊</span>Analytics</div>
            <div className="dash-tile"><span>🤝</span>Integrations</div>
            <div className="dash-tile"><span>🔒</span>Security</div>
          </div>
        </div>
      </div>
    </section>
  )
}
