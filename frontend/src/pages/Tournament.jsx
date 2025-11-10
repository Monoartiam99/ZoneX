import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Tournaments(){
  const [tournaments, setTournaments] = React.useState([])
  const { user } = useAuth()

  React.useEffect(()=>{
    axios.get('http://localhost:4000/api/tournaments')
      .then(r => setTournaments(r.data))
      .catch(()=>{})
  },[])

  return (
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
                  <Link to={`/login?next=/tournament/${t.id}`} className="btn small violet">
                      Sign In
                    </Link>
                    <Link to={`/`} className="btn small outline" style={{marginLeft:8}}>
                      Sign Up
                    </Link>
                </>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}