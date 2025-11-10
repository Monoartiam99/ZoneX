import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthModal from '../components/AuthModal'

export default function Tournaments(){
  const [tournaments, setTournaments] = React.useState([])
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState('login')
  const [authNext, setAuthNext] = React.useState('/')

  React.useEffect(()=>{
    axios.get('http://localhost:4000/api/tournaments')
      .then(r => setTournaments(r.data))
      .catch(()=>{})
  },[])

  return (
    <>
    <div className="tournament-page">
      
      {/* PAGE TITLE */}
      <h1 className="page-heading">Tournaments</h1>
      <p className="page-subtext">Join daily competitive tournaments and win exciting rewards</p>

      {/* GRID */}
      <div className="tournament-grid">
        {tournaments.map(t => (
          <div className="tournament-card" key={t.id}>
            
            {/* CARD HEADER */}
            <h3>{t.game}</h3>
            <div className="t-meta">
              {t.mode || "Squad Match"} • {t.time}
            </div>

            {/* INFO */}
            <div className="info-line">Entry Fee: <span>₹{t.entryFee}</span></div>
            <div className="info-line">Prize Pool: <span>₹{t.prizePool}</span></div>
            <div className="info-line">Slots: <span>{t.joined}/{t.slots}</span></div>

            {/* ACTIONS */}
            <div className="actions">
              {user ? (
                <Link to={`/tournament/${t.id}`} className="btn small violet">
                  Join Tournament
                </Link>
              ) : (
                <>
                  <button className="btn small violet" onClick={()=>{ setAuthMode('login'); setAuthNext(`/tournament/${t.id}`); setAuthOpen(true) }}>Sign In</button>
                  <button className="btn small outline" style={{marginLeft:8}} onClick={()=>{ setAuthMode('signup'); setAuthNext(`/tournament/${t.id}`); setAuthOpen(true) }}>Sign Up</button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>

    <AuthModal open={authOpen} mode={authMode} next={authNext} onClose={()=>setAuthOpen(false)} />
    </>
  )
}