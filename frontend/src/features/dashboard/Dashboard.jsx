import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowUpRight, BookOpen, BookmarkCheck, Check, ChevronDown, CircleCheck, CircleHelp, Code2, ExternalLink, Flame, LayoutDashboard, LogOut, Plus, RefreshCw, Target, TrendingUp, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../auth/authSlice'
import { clearDashboardError, createSubmission, loadDashboard, setSubmissionReview } from './dashboardSlice'
import Heatmap from './Heatmap'

const todayValue = () => {
  const today = new Date()
  const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

const initialForm = () => ({
  problemTitle: '', problemUrl: '', platform: 'LEETCODE', category: 'POTD',
  difficulty: 'MEDIUM', dateSolved: todayValue(), approachNotes: '', needsReview: false,
})

const formatDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
  month: 'short', day: 'numeric', year: 'numeric',
})

const readable = (value) => value.toLowerCase().replaceAll('_', ' ')

function MetricCard({ label, value, note, icon: Icon, tone, trend }) {
  return (
    <article className="metric-card">
      <div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={17} /></span></div>
      <div className="metric-value-row"><strong>{value}</strong>{trend && <span className="metric-trend"><ArrowUpRight size={14} /> {trend}</span>}</div>
      <div className="metric-note">{note}</div>
    </article>
  )
}

function ProblemForm({ onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await onSubmit({ ...form, problemUrl: form.problemUrl.trim() || null, approachNotes: form.approachNotes.trim() || null })
      onClose()
    } catch (message) {
      setError(message)
    }
  }

  return (
    <section className="log-panel" aria-labelledby="log-title">
      <div className="log-panel-heading">
        <div><span className="section-overline">KEEP THE MOMENTUM</span><h2 id="log-title">Log a solved problem</h2></div>
        <button className="icon-button" type="button" aria-label="Close form" onClick={onClose}><X size={18} /></button>
      </div>
      <form className="log-form" onSubmit={submit}>
        <div className="form-grid form-grid-main">
          <label className="form-control form-control-wide"><span>Problem title <b>*</b></span><input name="problemTitle" required maxLength="160" value={form.problemTitle} onChange={update} placeholder="e.g. Two Sum" /></label>
          <label className="form-control form-control-wide"><span>Problem link <small>optional</small></span><input name="problemUrl" type="url" maxLength="600" value={form.problemUrl} onChange={update} placeholder="https://leetcode.com/problems/..." /></label>
        </div>
        <div className="form-grid form-grid-selects">
          <label className="form-control"><span>Platform</span><span className="select-wrap"><select name="platform" value={form.platform} onChange={update}><option value="LEETCODE">LeetCode</option><option value="GEEKSFORGEEKS">GeeksforGeeks</option></select><ChevronDown size={15} /></span></label>
          <label className="form-control"><span>Track</span><span className="select-wrap"><select name="category" value={form.category} onChange={update}><option value="POTD">Problem of the day</option><option value="BOOTCAMP">Bootcamp</option><option value="PRACTICE">Practice</option></select><ChevronDown size={15} /></span></label>
          <label className="form-control"><span>Difficulty</span><span className="select-wrap"><select name="difficulty" value={form.difficulty} onChange={update}><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option></select><ChevronDown size={15} /></span></label>
          <label className="form-control"><span>Date solved</span><input name="dateSolved" type="date" required value={form.dateSolved} onChange={update} /></label>
        </div>
        <label className="form-control notes-control"><span>Approach notes <small>optional</small></span><textarea name="approachNotes" rows="3" maxLength="20000" value={form.approachNotes} onChange={update} placeholder="What was the key idea? Add a note for your future self…" /></label>
        <label className="review-check"><input name="needsReview" type="checkbox" checked={form.needsReview} onChange={(event) => setForm((current) => ({ ...current, needsReview: event.target.checked }))} /><span><BookmarkCheck size={15} /><b>Add to review queue</b><small>Remind me to revisit this after 7 and 14 days</small></span></label>
        {error && <p className="form-error log-error" role="alert">{error}</p>}
        <div className="form-actions"><span><CircleHelp size={14} /> Your notes are private to you.</span><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : <><Check size={16} /> Save problem</>}</button></div>
      </form>
    </section>
  )
}

function ProblemRow({ problem, onToggleReview }) {
  const isHard = problem.difficulty === 'HARD'
  return (
    <article className="problem-row">
      <div className={`problem-symbol ${problem.difficulty.toLowerCase()}`}><Code2 size={17} /></div>
      <div className="problem-info">
        <div className="problem-name-line"><h3>{problem.problemTitle}</h3>{problem.problemUrl && <a href={problem.problemUrl} target="_blank" rel="noreferrer" aria-label={`Open ${problem.problemTitle}`}><ExternalLink size={13} /></a>}</div>
        <p>{formatDate(problem.dateSolved)} <span>·</span> {problem.platform === 'GEEKSFORGEEKS' ? 'GeeksforGeeks' : 'LeetCode'} <span>·</span> {readable(problem.category)}</p>
      </div>
      <button className={`review-toggle ${problem.needsReview ? 'selected' : ''}`} type="button" onClick={() => onToggleReview(problem)} title={problem.needsReview ? 'Remove from review queue' : 'Add to review queue'}><BookmarkCheck size={14} /><span>{problem.needsReview ? 'In review' : 'Review'}</span></button>
      <span className={`difficulty-pill ${problem.difficulty.toLowerCase()}`}>{isHard && <ArrowUpRight size={12} />}{readable(problem.difficulty)}</span>
    </article>
  )
}

function daysSince(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const solved = new Date(`${date}T00:00:00`)
  return Math.floor((today - solved) / 86400000)
}

function ReviewView({ reviewQueue, onToggleReview, onLog }) {
  const due = reviewQueue.filter((problem) => daysSince(problem.dateSolved) >= 7).length
  return (
    <>
      <section className="welcome-row review-welcome">
        <div><div className="section-overline">MAKE IT STICK</div><h1>Your review queue<span className="welcome-period">.</span></h1><p>Come back to these problems and make the ideas yours.</p></div>
        <div className="review-summary"><BookmarkCheck size={16} /><b>{due}</b><span>{due === 1 ? 'problem ready' : 'problems ready'}</span></div>
      </section>
      <section className="review-card">
        <div className="review-card-heading"><div><span className="section-overline">SPACED PRACTICE</span><h2>Problems to revisit</h2><p>Marked problems appear here after 7 days, with another nudge at day 14.</p></div><span className="review-count">{reviewQueue.length} saved</span></div>
        {reviewQueue.length === 0
          ? <div className="empty-state"><div className="empty-illustration"><BookmarkCheck size={21} /></div><h3>Your queue is clear.</h3><p>Mark a problem for review when you log it, or add one from your recent solves.</p><button className="button button-soft" onClick={onLog}><Plus size={15} /> Log a problem</button></div>
          : <div className="review-list">{reviewQueue.map((problem) => {
            const age = daysSince(problem.dateSolved)
            const isDue = age >= 7
            const cycle = age >= 14 ? 14 : 7
            return <article className={`review-row ${isDue ? 'is-due' : ''}`} key={problem.id}>
              <div className={`problem-symbol ${problem.difficulty.toLowerCase()}`}><Code2 size={17} /></div>
              <div className="review-problem-info"><div className="problem-name-line"><h3>{problem.problemTitle}</h3>{problem.problemUrl && <a href={problem.problemUrl} target="_blank" rel="noreferrer" aria-label={`Open ${problem.problemTitle}`}><ExternalLink size={13} /></a>}</div><p>Solved {formatDate(problem.dateSolved)} <span>·</span> {problem.platform === 'GEEKSFORGEEKS' ? 'GeeksforGeeks' : 'LeetCode'} <span>·</span> {readable(problem.difficulty)}</p>{problem.approachNotes && <div className="review-notes">{problem.approachNotes}</div>}</div>
              <div className="review-row-actions"><span className={`review-due ${isDue ? 'due' : 'upcoming'}`}>{isDue ? `${cycle}-day review` : `Due in ${7 - age}d`}</span><button type="button" className="review-done" onClick={() => onToggleReview(problem, false)}><CircleCheck size={15} /> Reviewed</button></div>
            </article>
          })}</div>}
      </section>
      <footer className="page-footer"><span>Recall today. Remember tomorrow.</span><span>DSA SPRINT <i>✳</i></span></footer>
    </>
  )
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { submissions, streak, heatmap, reviewQueue, status, error, saving } = useSelector((state) => state.dashboard)
  const [showLog, setShowLog] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => { dispatch(loadDashboard()) }, [dispatch])

  const summary = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - 6)
    const weekTotal = submissions.filter((submission) => new Date(`${submission.dateSolved}T12:00:00`) >= weekStart).length
    const byDifficulty = submissions.reduce((result, entry) => {
      result[entry.difficulty] = (result[entry.difficulty] || 0) + 1
      return result
    }, { EASY: 0, MEDIUM: 0, HARD: 0 })
    return { weekTotal, byDifficulty }
  }, [submissions])

  const saveProblem = async (form) => {
    const result = await dispatch(createSubmission(form))
    if (createSubmission.rejected.match(result)) throw result.payload || 'Could not save this problem.'
    dispatch(loadDashboard())
  }

  const toggleReview = (problem, needsReview = !problem.needsReview) => {
    dispatch(setSubmissionReview({ id: problem.id, needsReview }))
  }

  const initials = user?.username?.slice(0, 1).toUpperCase() || 'D'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand-lockup sidebar-brand" href="#dashboard" aria-label="DSA Sprint home"><div className="brand-mark"><Code2 size={19} /></div><span>dsa<span className="brand-dot">.</span>sprint</span></a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button type="button" className={`nav-link ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}><LayoutDashboard size={17} /> Overview {activeView === 'overview' && <span className="nav-active-dot" />}</button>
          <button type="button" className={`nav-link ${activeView === 'review' ? 'active' : ''}`} onClick={() => setActiveView('review')}><BookmarkCheck size={17} /> Review queue <span className="nav-count">{reviewQueue.length}</span></button>
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip"><div className="tip-icon"><Target size={17} /></div><span className="tip-kicker">A NOTE TO SELF</span><p>Consistency beats intensity. One problem at a time.</p><div className="tip-spark">✳</div></div>
        <div className="sidebar-footer"><span className="footer-dot" /> Your progress is syncing</div>
      </aside>

      <main className="main-area" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeView === 'review' ? 'Review queue' : 'Overview'}</strong></div>
          <div className="topbar-actions">
            <button className="button button-quiet top-add" onClick={() => setShowLog(true)}><Plus size={16} /> Add problem</button>
            <div className="profile-menu-wrap">
              <button className="profile-button" onClick={() => setUserMenu((open) => !open)} aria-expanded={userMenu} aria-label="Open profile menu"><span className="avatar">{initials}</span><span className="profile-name">{user?.username}</span><ChevronDown size={14} /></button>
              {userMenu && <div className="profile-dropdown"><span className="dropdown-user">Signed in as <b>{user?.username}</b></span><button onClick={() => dispatch(signOut())}><LogOut size={15} /> Sign out</button></div>}
            </div>
          </div>
        </header>

        <div className="content-wrap">
          {error && <div className="error-banner" role="alert"><span>{error}</span><button onClick={() => dispatch(clearDashboardError())} aria-label="Dismiss error"><X size={16} /></button></div>}
          {activeView === 'review' ? <>{showLog && <ProblemForm onClose={() => setShowLog(false)} onSubmit={saveProblem} saving={saving} />}<ReviewView reviewQueue={reviewQueue} onToggleReview={toggleReview} onLog={() => setShowLog(true)} /></> : <>
          <section className="welcome-row">
            <div>
              <div className="section-overline">YOUR PRACTICE SPACE</div>
              <h1>Good to see you, {user?.username}<span className="welcome-period">.</span></h1>
              <p>Every problem you solve is progress worth keeping.</p>
            </div>
            <div className="welcome-actions"><span className="today-label"><span className="today-pulse" /> {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span><button className="button button-primary" onClick={() => setShowLog(true)}><Plus size={17} /> Log a problem</button></div>
          </section>

          <section className="metrics-grid" aria-label="Progress summary">
            <MetricCard label="POTD streak" value={<>{streak}<small> days</small></>} note={streak ? 'Keep the chain alive' : 'Solve a POTD to get started'} icon={Flame} tone="orange" />
            <MetricCard label="Problems logged" value={submissions.length} note="Your practice, all in one place" icon={Activity} tone="green" />
            <MetricCard label="Last 7 days" value={summary.weekTotal} note="Problems solved this week" icon={TrendingUp} tone="blue" trend={summary.weekTotal > 0 ? 'in motion' : null} />
            <MetricCard label="Bootcamp progress" value={<>{summary.byDifficulty.EASY + summary.byDifficulty.MEDIUM + summary.byDifficulty.HARD}<small> solved</small></>} note={`${summary.byDifficulty.EASY} easy · ${summary.byDifficulty.MEDIUM} medium · ${summary.byDifficulty.HARD} hard`} icon={BookOpen} tone="purple" />
          </section>

          {showLog && <ProblemForm onClose={() => setShowLog(false)} onSubmit={saveProblem} saving={saving} />}

          <section className="activity-card">
            <div className="card-heading">
              <div><span className="section-overline">SHOWING UP ADDS UP</span><h2>Your activity</h2><p>A year of problems, one small square at a time.</p></div>
              <div className="activity-total"><strong>{submissions.length}</strong><span>total solves</span></div>
            </div>
            <div className="heatmap-container"><Heatmap values={heatmap} /></div>
          </section>

          <section className="recent-card">
            <div className="recent-heading"><div><span className="section-overline">THE LATEST WINS</span><h2>Recently solved</h2></div><button className="text-button" onClick={() => dispatch(loadDashboard())} disabled={status === 'loading'}><RefreshCw size={14} className={status === 'loading' ? 'spin' : ''} /> Refresh</button></div>
            {status === 'loading' && submissions.length === 0
              ? <div className="empty-state"><span className="loading-orbit" /><p>Gathering your progress…</p></div>
              : submissions.length > 0
                ? <div className="problem-list">{submissions.slice(0, 6).map((problem) => <ProblemRow key={problem.id} problem={problem} onToggleReview={toggleReview} />)}</div>
                : <div className="empty-state"><div className="empty-illustration"><Code2 size={21} /><span>✳</span></div><h3>Your first solve goes here.</h3><p>Log a problem and start building your practice history.</p><button className="button button-soft" onClick={() => setShowLog(true)}><Plus size={15} /> Add your first problem</button></div>}
            {submissions.length > 6 && <div className="list-footnote">Showing the latest 6 of {submissions.length} problems</div>}
          </section>

          <footer className="page-footer"><span>Keep learning, one problem at a time.</span><span>DSA SPRINT <i>✳</i></span></footer>
          </>}
        </div>
      </main>
    </div>
  )
}
