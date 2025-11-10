import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../auth'

export default function Home() {
  const [tournaments, setTournaments] = React.useState([])
  const { user, logout } = useAuth()

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
                    <Link className="btn violet small" to="/">Login</Link>
                    <Link className="btn outline small" to="/" style={{marginLeft:6}}>Register</Link>
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
                    <Link className="btn small" to={`/login?next=/tournament/${t.id}`}>Sign In</Link>
                    <Link className="btn small outline" to={`/register?next=/tournament/${t.id}`}>Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}