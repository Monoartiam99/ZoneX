import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../auth'

export default function Home(){
  const [tournaments,setTournaments] = React.useState([])
  React.useEffect(()=>{
    axios.get('http://localhost:4000/api/tournaments').then(r=>setTournaments(r.data)).catch(()=>{})
  },[])
  const { user } = useAuth()

  return (
    <div className="fg-app container">
      <header className="fg-header">
        <div className="logo">HostedGames</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Play • Compete • Win Cash</h1>
          <p>Daily tournaments for Free Fire, BGMI, CODM & more</p>
          <Link className="btn primary" to="/tournaments">Join Tournament Now</Link>
        </section>

        <section>
          <h2>Live Tournaments</h2>
          <div className="grid">
            {tournaments.map(t=> (
              <div key={t.id} className="card">
                <h4>{t.game}</h4>
                <div>{t.time} • ₹{t.entryFee} • {t.slots} slots</div>
                <div className="actions">
                  {user ? (
                    <Link to={`/tournament/${t.id}`} className="btn">Join</Link>
                  ) : (
                    <>
                      <Link to={`/login?next=/tournament/${t.id}`} className="btn">Sign In</Link>
                      <Link to={`/login?next=/tournament/${t.id}&mode=signup`} className="btn outline" style={{marginLeft:8}}>Sign Up</Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
