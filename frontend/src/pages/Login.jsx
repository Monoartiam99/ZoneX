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
        <form onSubmit={handleRegister} aria-labelledby="su-heading">
          <h1 id="su-heading">Create Account</h1>
          <div className="social-icons" role="navigation" aria-label="social sign in">
            <a href="#" className="icon" aria-label="Sign up with Google"><i className="fa-brands fa-google-plus-g" aria-hidden="true"></i></a>
            <a href="#" className="icon" aria-label="Sign up with Facebook"><i className="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
            <a href="#" className="icon" aria-label="Sign up with GitHub"><i className="fa-brands fa-github" aria-hidden="true"></i></a>
            <a href="#" className="icon" aria-label="Sign up with LinkedIn"><i className="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
          </div>
          <span>or use your email for registration</span>
          <label className="sr-only" htmlFor="su-name">Name</label>
          <input id="su-name" name="name" aria-required="true" value={suName} onChange={e=>setSuName(e.target.value)} type="text" placeholder="Name" />
          <label className="sr-only" htmlFor="su-email">Email</label>
          <input id="su-email" name="email" aria-required="true" value={suEmail} onChange={e=>setSuEmail(e.target.value)} type="email" placeholder="Email" />
          <label className="sr-only" htmlFor="su-password">Password</label>
          <input id="su-password" name="password" aria-required="true" value={suPassword} onChange={e=>setSuPassword(e.target.value)} type="password" placeholder="Password" />
          <button type="submit" disabled={loading} aria-disabled={loading}>{loading ? 'Please wait...' : 'Sign Up'}</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleLogin} aria-labelledby="li-heading">
          <h1 id="li-heading">Log In</h1>
          <div className="social-icons" role="navigation" aria-label="social sign in">
            <a href="#" className="icon" aria-label="Sign in with Google"><i className="fa-brands fa-google-plus-g" aria-hidden="true"></i></a>
            <a href="#" className="icon" aria-label="Sign in with Facebook"><i className="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
            <a href="#" className="icon" aria-label="Sign in with GitHub"><i className="fa-brands fa-github" aria-hidden="true"></i></a>
            <a href="#" className="icon" aria-label="Sign in with LinkedIn"><i className="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
          </div>
          <span>or use your email password</span>
          <label className="sr-only" htmlFor="li-email">Email</label>
          <input id="li-email" name="email" aria-required="true" value={liEmail} onChange={e=>setLiEmail(e.target.value)} type="email" placeholder="Email" />
          <label className="sr-only" htmlFor="li-password">Password</label>
          <input id="li-password" name="password" aria-required="true" value={liPassword} onChange={e=>setLiPassword(e.target.value)} type="password" placeholder="Password" />
          <a href="#" aria-label="Forgot your password">Forget Your Password?</a>
          <button type="submit" disabled={loading} aria-disabled={loading}>{loading ? 'Please wait...' : 'LOG In'}</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button type="button" className="hidden" id="login" onClick={()=>setActive(false)} aria-pressed={!active}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button type="button" className="hidden" id="register" onClick={()=>setActive(true)} aria-pressed={active}>Sign Up</button>
          </div>
        </div>
      </div>
      {error && <div style={{position:'fixed',left:20,bottom:20,background:'#ffecec',color:'#b00020',padding:12,borderRadius:8}}>{error}</div>}
    </div>
  )
}
