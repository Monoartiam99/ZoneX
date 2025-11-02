import React from 'react'
import axios from 'axios'

export default function Leaderboard(){
  const [data,setData] = React.useState([])
  React.useEffect(()=>{ axios.get('http://localhost:4000/api/leaderboard').then(r=>setData(r.data)).catch(()=>{}) },[])
  return (
    <div className="container">
      <h1>Leaderboard</h1>
      <table className="leaderboard"><thead><tr><th>Rank</th><th>Player</th><th>Matches</th><th>Wins</th><th>Earnings</th></tr></thead>
      <tbody>{data.map(r=> <tr key={r.rank}><td>#{r.rank}</td><td>{r.player}</td><td>{r.matches}</td><td>{r.wins}</td><td>₹{r.earnings}</td></tr>)}</tbody>
      </table>
    </div>
  )
}
