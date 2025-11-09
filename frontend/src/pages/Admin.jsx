import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth'

export default function Admin(){
  const [form,setForm] = React.useState({game:'Free Fire', time:'9:00 PM', entryFee:10, slots:50, prizePool:400})
  const {user, loading} = useAuth()
  if(!loading && (!user || !user.isAdmin)){
    return <div className="container"><h2>Access denied — admin only</h2></div>
  }
  const create = async ()=>{
    try{
      const res = await axios.post('http://localhost:4000/api/admin/tournaments', form, {headers:{'x-admin-token':'demo-admin-token'}})
      alert('Created: '+ res.data.t.id)
    }catch(e){ alert('Error creating') }
  }
  const presetFreeFire = ()=>{
    setForm({game:'Free Fire', time:'9:00 PM', entryFee:49, slots:50, prizePool:49*50})
  }
  return (
    <div className="container">
      <h1>Admin</h1>
      <div className="card">
        <h3>Create Tournament</h3>
        <div style={{marginBottom:10}}>
          <button className="btn" onClick={presetFreeFire}>Preset: Free Fire ₹49 (50 slots)</button>
        </div>
        <label>Game<input value={form.game} onChange={e=>setForm({...form,game:e.target.value})} /></label>
        <label>Time<input value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></label>
        <label>Entry Fee<input type="number" value={form.entryFee} onChange={e=>setForm({...form,entryFee:Number(e.target.value)})} /></label>
        <label>Slots<input type="number" value={form.slots} onChange={e=>setForm({...form,slots:Number(e.target.value)})} /></label>
        <label>Prize Pool<input type="number" value={form.prizePool} onChange={e=>setForm({...form,prizePool:Number(e.target.value)})} /></label>
        <div style={{marginTop:12}}><button className="btn primary" onClick={create}>Create</button></div>
      </div>
    </div>
  )
}
