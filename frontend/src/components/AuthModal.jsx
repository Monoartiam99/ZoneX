import React from 'react'
import { useAuth } from '../auth'

export default function AuthModal({open, mode='login', next='/', onClose}){
  const { login, signup } = useAuth()
  const [m, setM] = React.useState(mode)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')

  React.useEffect(()=>{ setM(mode); setError('') },[mode, open])

  if(!open) return null

  const doClose = ()=>{
    setLoading(false)
    setError('')
    onClose && onClose()
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      if(m === 'login'){
        await login(email || name, password)
      } else {
        if(password !== confirm) throw new Error('Passwords do not match')
        await signup(name || email, password)
      }
      doClose()
      // navigate to next if provided
      if(next) window.location.href = next
    }catch(err){
      setError(err.response?.data?.message || err.message || 'Failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="auth-modal" role="dialog" aria-hidden={!open} aria-label={m==='login'? 'Login':'Sign up'}>
      <div className="auth-panel">
        <button className="auth-close" onClick={doClose} aria-label="Close">×</button>
  <h2>{m==='login' ? 'Login to VLX' : 'Join VLX'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {m==='signup' && (
            <label>
              Full Name
              <input className="auth-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" />
            </label>
          )}

          <label>
            Email
            <input className="auth-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" className="auth-input" value={password} onChange={e=>setPassword(e.target.value)} placeholder={m==='login' ? 'Password' : 'Create password'} />
          </label>

          {m==='signup' && (
            <label>
              Confirm Password
              <input type="password" className="auth-input" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm password" />
            </label>
          )}

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-actions">
            <button className="btn auth-submit" type="submit" disabled={loading}>{m==='login' ? 'Login' : 'Register'}</button>
          </div>
        </form>

        <div className="auth-footer">
          {m==='login' ? (
            <p>New user? <button className="linkish" onClick={()=>setM('signup')}>Register here</button></p>
          ) : (
            <p>Already have an account? <button className="linkish" onClick={()=>setM('login')}>Sign in</button></p>
          )}
        </div>
        {/* progress bar: shows while loading */}
        <div className={`auth-progress ${loading ? 'active' : ''}`} aria-hidden={!loading}>
          <div className="auth-progress-bar" />
        </div>
      </div>
    </div>
  )
}
