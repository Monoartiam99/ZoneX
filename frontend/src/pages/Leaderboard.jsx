import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthModal from '../components/AuthModal'

export default function Leaderboard(){
  const [data,setData] = React.useState([])
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState('login')
  const [authNext, setAuthNext] = React.useState('/')
  React.useEffect(()=>{ axios.get('http://localhost:4000/api/leaderboard').then(r=>setData(r.data)).catch(()=>{}) },[])
  return (
    <div className="container">
      <h1>Leaderboard</h1>
      {!user && (
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <button className="btn primary" onClick={()=>{ setAuthMode('login'); setAuthNext('/leaderboard'); setAuthOpen(true) }}>Sign In</button>
          <button className="btn" onClick={()=>{ setAuthMode('signup'); setAuthNext('/leaderboard'); setAuthOpen(true) }}>Sign Up</button>
        </div>
      )}
      <AuthModal open={authOpen} mode={authMode} next={authNext} onClose={()=>setAuthOpen(false)} />
      <table className="leaderboard"><thead><tr><th>Rank</th><th>Player</th><th>Matches</th><th>Wins</th><th>Earnings</th></tr></thead>
      <tbody>{data.map(r=> <tr key={r.rank}><td>#{r.rank}</td><td>{r.player}</td><td>{r.matches}</td><td>{r.wins}</td><td>₹{r.earnings}</td></tr>)}</tbody>
      </table>
    </div>
  )
}
