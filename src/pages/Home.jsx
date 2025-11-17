import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../auth'

export default function Home() {
  const [tournaments, setTournaments] = React.useState([])
  const { user, logout } = useAuth()

  // sensible fallback tournaments (used if backend is empty/unreachable)
  const fallbackTournaments = [
    { id: 'f1', game: 'Free Fire', time: '7:00 PM, Nov 25', entryFee: 20, slots: 50, joined: 12, prizePool: 800, type: 'Squad' },
    { id: 'f2', game: 'BGMI', time: '9:00 PM, Nov 25', entryFee: 50, slots: 40, joined: 28, prizePool: 1500, type: 'Solo' },
    { id: 'f3', game: 'CODM', time: '6:30 PM, Nov 26', entryFee: 30, slots: 30, joined: 8, prizePool: 900, type: 'Duo' },
    { id: 'f4', game: 'Valorant', time: '8:00 PM, Nov 27', entryFee: 100, slots: 10, joined: 6, prizePool: 900, type: 'Team' }
  ]

  React.useEffect(() => {
    let mounted = true
    axios.get('http://localhost:4000/api/tournaments')
      .then(r => {
        if (!mounted) return
        // ensure consistent fields — fill missing fields with fallback-like values
        const data = Array.isArray(r.data) && r.data.length ? r.data.map((t, idx) => ({
          id: t.id ?? `srv-${idx}`,
          game: t.game ?? fallbackTournaments[idx % fallbackTournaments.length].game,
          time: t.time ?? fallbackTournaments[idx % fallbackTournaments.length].time,
          entryFee: typeof t.entryFee === 'number' ? t.entryFee : fallbackTournaments[idx % fallbackTournaments.length].entryFee,
          slots: t.slots ?? fallbackTournaments[idx % fallbackTournaments.length].slots,
          joined: t.joined ?? Math.min( Math.floor((t.slots ?? fallbackTournaments[idx % fallbackTournaments.length].slots) * 0.3), fallbackTournaments[idx % fallbackTournaments.length].slots ),
          prizePool: t.prizePool ?? ( (t.entryFee ?? fallbackTournaments[idx % fallbackTournaments.length].entryFee) * (t.slots ?? fallbackTournaments[idx % fallbackTournaments.length].slots) * 0.6 ),
          type: t.type ?? fallbackTournaments[idx % fallbackTournaments.length].type
        })) : fallbackTournaments

        setTournaments(data)
      })
      .catch(() => {
        // on error use fallback
        setTournaments(fallbackTournaments)
      })

    return () => { mounted = false }
  }, [])

  // hero stats derived from tournaments (use fixed aggregation)
  const totalTournaments = tournaments.length
  const totalSlots = tournaments.reduce((s, t) => s + (t.slots || 0), 0)
  const totalPrizePool = Math.round(tournaments.reduce((s, t) => s + (t.prizePool || 0), 0))

  return (
    <div className="homepage">

      <header className="navbar glass-nav fixed-top">
        <div className="logo">ValorX - Skills Got A Stage</div>

        <nav aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <div className="auth" role="group" aria-label="Authentication">
          {user ? (
            <>
              <Link className="btn small violet" to="/profile">Profile</Link>
              <button className="btn small outline" onClick={logout} aria-label="Logout">Logout</button>
            </>
          ) : (
            <>
              <Link className="btn small violet" to="/login">Login</Link>
              <Link className="btn small outline" to="/login?mode=signup">Register</Link>
            </>
          )}
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-heading">
        {/* background video */}
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/homepage-vid1.mp4" type="video/mp4" />
          {/* fallback: if video can't play, browser will ignore */}
        </video>

        <div className="hero-overlay" />

        <div className="hero-inner">
          <h1 id="hero-heading">Play • Compete • Win Cash</h1>
          <p>Daily tournaments for Free Fire, BGMI, CODM, Valorant & more — skill-based matches, fair rules, real cash prizes.</p>

          <div className="hero-cta">
            <Link className="btn big violet" to="/tournaments">Join Tournament Now</Link>
            <Link className="btn big outline" to="/tournaments">View Schedule</Link>
          </div>

          <div className="hero-stats" aria-hidden>
            <div className="stat">
              <div className="stat-value">{totalTournaments}</div>
              <div className="stat-label">Live Tournaments</div>
            </div>
            <div className="stat">
              <div className="stat-value">{totalSlots}</div>
              <div className="stat-label">Total Slots</div>
            </div>
            <div className="stat">
              <div className="stat-value">₹{totalPrizePool}</div>
              <div className="stat-label">Prize Pool</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tournament-section" aria-labelledby="live-heading">
        <h2 id="live-heading">Live Tournaments</h2>

        <div className="tournament-grid" role="list">
          {tournaments.map(t => (
            <article key={t.id} className="tournament-card" role="listitem" aria-labelledby={`t-${t.id}-title`}>
              <h3 id={`t-${t.id}-title`}>
                <span className="t-type">{t.type}</span> {t.game}
              </h3>

              <div className="t-meta">{t.time}</div>

              <div className="info-line"><strong>Entry Fee:</strong> <span>₹{t.entryFee}</span></div>
              <div className="info-line"><strong>Prize Pool:</strong> <span>₹{t.prizePool}</span></div>
              <div className="info-line"><strong>Slots:</strong> <span>{t.slots}</span> • <strong>Joined:</strong> <span>{t.joined}</span></div>

              <div className="actions">
                {user ? (
                  <Link className="btn small violet" to={`/tournament/${t.id}`}>Join</Link>
                ) : (
                  <>
                    <Link className="btn small" to={`/login?next=/tournament/${t.id}`}>Sign In</Link>
                    <Link className="btn small outline" to={`/login?next=/tournament/${t.id}&mode=signup`}>Sign Up</Link>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-heading">
        <div className="about-inner">
          <div className="about-text">
            <h2 id="about-heading">About HostedGames</h2>
            <p>HostedGames is a community-first tournament platform focused on fair, competitive play. We organize daily events across popular mobile and PC titles — curated match formats, verified winners, and fast payouts.</p>

            <p>Whether you're a casual player or a pro, our tournaments are designed to be fun, transparent and rewarding. Join today and start climbing leaderboards.</p>

            <ul className="about-list" aria-hidden>
              <li>Secure payments & payouts</li>
              <li>Anti-cheat & fair play</li>
              <li>Daily live matches</li>
              <li>Instant leaderboards</li>
            </ul>
          </div>

          <aside className="about-cards" aria-hidden>
            <div className="feature-card">
              <div className="icon">🏆</div>
              <div>
                <div className="fc-title">Real Prizes</div>
                <div className="fc-desc">Transparent prize distribution with instant winner verification.</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon">⚡</div>
              <div>
                <div className="fc-title">Fast Matchmaking</div>
                <div className="fc-desc">Quick lobbies, smooth match start and a polished experience.</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon">🔒</div>
              <div>
                <div className="fc-title">Secure</div>
                <div className="fc-desc">Payments and user accounts protected with best practices.</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="f-left">
            <div className="logo small">HostedGames</div>
            <div className="muted">© {new Date().getFullYear()} HostedGames • Built for gamers</div>
          </div>
          <div className="f-right">
            <nav aria-label="footer">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
