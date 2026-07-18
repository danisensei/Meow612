import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import './AuthModal.css'

export default function AuthModal({ open, onClose, onSuccess }) {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  if (!open) return null

  const reset = () => { setEmail(''); setPassword(''); setError(null); setSuccessMsg(null) }

  const switchTab = (t) => { setTab(t); reset() }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)
    try {
      if (tab === 'signin') {
        await signIn(email, password)
        onSuccess?.('Welcome back! 👋')
        onClose()
      } else {
        const { user } = await signUp(email, password)
        if (user && !user.confirmed_at) {
          setSuccessMsg('Check your email to confirm your account, then sign in.')
        } else {
          onSuccess?.('Account created! Welcome to Meow612 🎉')
          onClose()
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="auth-overlay" onClick={onClose} />
      <div className="auth-modal">
        <button className="auth-modal__close" onClick={onClose}>✕</button>

        <div className="auth-modal__logo">
          <span className="auth-modal__logo-text">MEOW<span>612</span></span>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'signin' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('signin')}
          >Sign In</button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('signup')}
          >Create Account</button>
          <div className={`auth-tab-indicator ${tab === 'signup' ? 'auth-tab-indicator--right' : ''}`} />
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              id="auth-email"
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              id="auth-password"
            />
          </div>

          {error && <p className="auth-error">⚠️ {error}</p>}
          {successMsg && <p className="auth-success">✅ {successMsg}</p>}

          <button type="submit" className="auth-submit" disabled={loading} id="auth-submit-btn">
            {loading ? <span className="auth-spinner" /> : (tab === 'signin' ? 'Sign In →' : 'Create Account →')}
          </button>
        </form>

        {tab === 'signin' && (
          <p className="auth-switch">
            No account?{' '}
            <button onClick={() => switchTab('signup')}>Sign up free</button>
          </p>
        )}
        {tab === 'signup' && (
          <p className="auth-switch">
            Already have one?{' '}
            <button onClick={() => switchTab('signin')}>Sign in</button>
          </p>
        )}
      </div>
    </>
  )
}
