import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Tournament(){
  const {id} = useParams()
  const [t,setT] = React.useState(null)
  React.useEffect(()=>{ axios.get(`http://localhost:4000/api/tournaments/${id}`).then(r=>setT(r.data)).catch(()=>{}) },[id])
  if(!t) return <div className="container">Loading...</div>
  return (
    <div className="container">
      <h1>{t.game} — Squad Match</h1>
      <p><strong>Date:</strong> 29 Oct | {t.time}</p>
      <p><strong>Map:</strong> Bermuda</p>
      <p><strong>Entry Fee:</strong> ₹{t.entryFee}</p>
      <p><strong>Prize Pool:</strong> ₹{t.prizePool} (Top 30 winners)</p>
      <p><strong>Slots:</strong> {t.slots} Players ({t.joined} Joined)</p>
      <button className="btn primary">Pay & Join</button>
    </div>
  )
}
