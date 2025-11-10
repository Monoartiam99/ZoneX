import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthModal from '../components/AuthModal'

export default function Tournaments(){
  const [tournaments,setTournaments] = React.useState([])
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState('login')
  const [authNext, setAuthNext] = React.useState('/')
  React.useEffect(()=>{ axios.get('http://localhost:4000/api/tournaments').then(r=>setTournaments(r.data)).catch(()=>{}) },[])
  return (
    <>
    <div className="container">
      <h1>Tournaments</h1>
      <div className="grid">
        {tournaments.map(t=> (
          <div className="card" key={t.id}>
            <h3>{t.game} — Squad Match</h3>
            <p>Date: 29 Oct | {t.time}</p>
            <p>Entry Fee: ₹{t.entryFee}</p>
            <p>Prize Pool: ₹{t.prizePool}</p>
            <p>Slots: {t.slots} ( {t.joined} joined )</p>
            {user ? (
              <Link to={`/tournament/${t.id}`} className="btn primary">JOIN NOW</Link>
            ) : (
                 <div style={{display:'flex',gap:8}}>
                 <button className="btn primary" onClick={()=>{ setAuthMode('login'); setAuthNext(`/tournament/${t.id}`); setAuthOpen(true) }}>Sign In</button>
                 <button className="btn" onClick={()=>{ setAuthMode('signup'); setAuthNext(`/tournament/${t.id}`); setAuthOpen(true) }}>Sign Up</button>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <AuthModal open={authOpen} mode={authMode} next={authNext} onClose={()=>setAuthOpen(false)} />
    </>
  )
}
