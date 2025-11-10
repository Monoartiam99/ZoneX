import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../auth'
import AuthModal from '../components/AuthModal'

export default function Home() {
  const [tournaments, setTournaments] = React.useState([])
  const { user, logout } = useAuth()
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState('login')
  const [authNext, setAuthNext] = React.useState('/')

  React.useEffect(() => {
    axios.get('http://localhost:4000/api/tournaments')
      .then(r => setTournaments(r.data))
      .catch(() => {})
  }, [])

  return (
    <div className="homepage">

      <header className="navbar glass-nav fixed-top">
        <div className="logo">ValorX</div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <div className="auth">
          {user ? (
            <>
              <Link className="btn violet small" to="/profile">Profile</Link>
              <button className="btn outline small" onClick={logout}>Logout</button>
            </>
              ) : (
                <>
                    <button className="btn violet small" onClick={()=>{ setAuthMode('login'); setAuthNext('/'); setAuthOpen(true) }}>Login</button>
                    <button className="btn outline small" style={{marginLeft:6}} onClick={()=>{ setAuthMode('signup'); setAuthNext('/'); setAuthOpen(true) }}>Register</button>
                  </>
                )}
        </div>
      </header>

      <section className="hero-section">
        <h1>Play • Compete • Win Cash</h1>
        <p>Daily tournaments for Free Fire, BGMI, CODM & more</p>
        <Link className="btn big violet" to="/tournaments">Join Tournament Now</Link>
      </section>

      <section className="tournament-section">
        <h2>Live Tournaments</h2>

        <div className="tournament-grid">
          {tournaments.map(t => (
            <div key={t.id} className="tournament-card">
              <h3>{t.game}</h3>
              <p>{t.time} • ₹{t.entryFee} • {t.slots} slots</p>

              <div className="actions">
                {user ? (
                  <Link className="btn small violet" to={`/tournament/${t.id}`}>Join</Link>
                ) : (
                  <>
                    <button className="btn small" onClick={()=>{ setAuthMode('login'); setAuthNext(`/tournament/${t.id}`); setAuthOpen(true) }}>Sign In</button>
                    <button className="btn small outline" onClick={()=>{ setAuthMode('signup'); setAuthNext(`/tournament/${t.id}`); setAuthOpen(true) }}>Sign Up</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AuthModal open={authOpen} mode={authMode} next={authNext} onClose={()=>setAuthOpen(false)} />

    </div>
  )
}