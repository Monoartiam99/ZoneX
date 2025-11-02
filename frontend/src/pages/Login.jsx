import React from 'react'
import { useAuth } from '../auth'
import './modern-login.css'

export default function Login(){
  const {login,signup,user} = useAuth()
  const [active, setActive] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  // signup fields
  const [suName, setSuName] = React.useState('')
  const [suEmail, setSuEmail] = React.useState('')
  const [suPassword, setSuPassword] = React.useState('')

  // login fields
  const [liEmail, setLiEmail] = React.useState('')
  const [liPassword, setLiPassword] = React.useState('')

  React.useEffect(()=>{ if(user) window.location.href='/' },[user])

  // inject font-awesome CDN so social icons render (safe to do client-side)
  React.useEffect(()=>{
    const id = 'fa-cdn'
    if(!document.getElementById(id)){
      const l = document.createElement('link')
      l.id = id
      l.rel = 'stylesheet'
      l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
      document.head.appendChild(l)
    }
  },[])

  const handleRegister = async (e)=>{
    e.preventDefault(); setError(null); setLoading(true)
    try{
      // your backend signup expects (name, password)
      await signup(suName || suEmail, suPassword)
      window.location.href = '/'
    }catch(err){ setError(err.response?.data?.error || err.message || 'Signup failed') }
    finally{ setLoading(false) }
  }

  const handleLogin = async (e)=>{
    e.preventDefault(); setError(null); setLoading(true)
    try{
      // login expects name; use email field if name is not available
      await login(liEmail, liPassword)
      window.location.href = '/'
    }catch(err){ setError(err.response?.data?.error || err.message || 'Login failed') }
    finally{ setLoading(false) }
  }

  return (
    <div className={"modern-page " + ("container" + (active ? ' active' : ''))} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registeration</span>
          <input value={suName} onChange={e=>setSuName(e.target.value)} type="text" placeholder="Name" />
          <input value={suEmail} onChange={e=>setSuEmail(e.target.value)} type="email" placeholder="Email" />
          <input value={suPassword} onChange={e=>setSuPassword(e.target.value)} type="password" placeholder="Password" />
          <button disabled={loading}>{loading ? 'Please wait...' : 'Sign Up'}</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Log In</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or use your email password</span>
          <input value={liEmail} onChange={e=>setLiEmail(e.target.value)} type="email" placeholder="Email" />
          <input value={liPassword} onChange={e=>setLiPassword(e.target.value)} type="password" placeholder="Password" />
          <a href="#">Forget Your Password?</a>
          <button disabled={loading}>{loading ? 'Please wait...' : 'LOG In'}</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" id="login" onClick={()=>setActive(false)}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className="hidden" id="register" onClick={()=>setActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
      {error && <div style={{position:'fixed',left:20,bottom:20,background:'#ffecec',color:'#b00020',padding:12,borderRadius:8}}>{error}</div>}
    </div>
  )
}
