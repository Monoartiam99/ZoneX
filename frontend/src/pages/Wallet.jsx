import React from 'react'
import axios from 'axios'

export default function Wallet(){
  const [data,setData] = React.useState(null)
  React.useEffect(()=>{ axios.get('http://localhost:4000/api/wallet/u1').then(r=>setData(r.data)).catch(()=>{}) },[])
  if(!data) return <div className="container">Loading...</div>
  return (
    <div className="container">
      <h1>Wallet</h1>
      <div className="card">
        <h3>Balance: ₹{data.user.wallet}</h3>
        <div className="actions">
          <button className="btn">+ Add Money</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
      <h2>Transactions</h2>
      <ul>
        {data.transactions.map(tx=> <li key={tx.id}>{tx.type==='credit'?'+':'-'}₹{tx.amount} {tx.note}</li>)}
      </ul>
    </div>
  )
}
