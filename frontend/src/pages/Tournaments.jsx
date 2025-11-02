import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Tournaments(){
  const [tournaments,setTournaments] = React.useState([])
  React.useEffect(()=>{ axios.get('http://localhost:4000/api/tournaments').then(r=>setTournaments(r.data)).catch(()=>{}) },[])
  return (
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
            <Link to={`/tournament/${t.id}`} className="btn primary">JOIN NOW</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
