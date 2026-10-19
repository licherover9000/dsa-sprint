import { useState } from 'react'
import { ArrowRight, Check, Code2, Flame, LockKeyhole, Sparkles } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, loginUser, registerUser } from './authSlice'

export default function AuthScreen({ mode, onModeChange }) {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.auth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const registering = mode === 'register'
  const busy = status === 'loading'

  const changeMode = (nextMode) => {
    dispatch(clearAuthError())
    onModeChange(nextMode)
  }

  const submit = async (event) => {
    event.preventDefault()
    const action = registering ? registerUser : loginUser
    await dispatch(action({ username: username.trim(), password }))
  }

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <div className="brand-lockup">
          <div className="brand-mark"><Code2 size={20} strokeWidth={2.3} /></div>
          <span>dsa<span className="brand-dot">.</span>sprint</span>
        </div>
        <div className="story-copy">
          <div className="eyebrow"><Sparkles size={14} /> YOUR PRACTICE, IN MOTION</div>
          <h1>Small steps.<br /><em>Serious</em> momentum.</h1>
          <p>A calm place to keep your DSA practice visible, your notes close, and your streak moving.</p>
          <div className="story-checks">
            <span><Check size={15} /> See your progress at a glance</span>
            <span><Check size={15} /> Keep every approach in one place</span>
            <span><Check size={15} /> Make showing up a habit</span>
          </div>
        </div>
        <div className="story-foot"><span className="story-line" /> Built for the long game <span>✳</span></div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          <div className="mobile-brand brand-lockup">
            <div className="brand-mark"><Code2 size={20} /></div><span>dsa<span className="brand-dot">.</span>sprint</span>
          </div>
          <div className="auth-heading">
            <div className="auth-kicker">{registering ? 'A fresh start' : 'Welcome back'}</div>
            <h2>{registering ? 'Create your account' : 'Pick up where you left off.'}</h2>
            <p>{registering ? 'Your next solved problem starts here.' : 'Your progress is right where you left it.'}</p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <label className="field-label" htmlFor="username">Username</label>
            <input id="username" autoComplete="username" required minLength={3} maxLength={40}
              value={username} onChange={(event) => setUsername(event.target.value)} placeholder="e.g. alex_codes" />
            <label className="field-label" htmlFor="password">Password</label>
            <div className="password-field">
              <LockKeyhole size={16} aria-hidden="true" />
              <input id="password" type="password" autoComplete={registering ? 'new-password' : 'current-password'}
                required minLength={8} maxLength={100} value={password}
                onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" type="submit" disabled={busy}>
              {busy ? 'One moment…' : registering ? 'Create account' : 'Sign in'}
              {!busy && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="auth-switch">
            {registering ? 'Already have an account?' : 'New to DSA Sprint?'}{' '}
            <button type="button" onClick={() => changeMode(registering ? 'login' : 'register')}>
              {registering ? 'Sign in' : 'Create an account'}
            </button>
          </p>
          <div className="auth-note"><LockKeyhole size={13} /> Your notes stay private to your account.</div>
        </div>
      </section>
      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />
      <div className="story-card" aria-hidden="true">
        <div className="story-card-top"><span><Flame size={15} /> DAILY RHYTHM</span><b>+1 day</b></div>
        <div className="story-card-count">12 <small>day streak</small></div>
        <div className="mini-grid">{Array.from({ length: 35 }, (_, index) => <i key={index} className={`mini-cell tone-${(index * 7 + 3) % 5}`} />)}</div>
      </div>
    </main>
  )
}
