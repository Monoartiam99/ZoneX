import React from 'react'
import axios from 'axios'

const AuthContext = React.createContext(null)

export function AuthProvider({children}){
  const [user,setUser] = React.useState(null)
  const [loading,setLoading] = React.useState(true)

  React.useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){ setLoading(false); return }
    axios.get('http://localhost:4000/api/auth/me', {headers:{Authorization: 'Bearer '+token}})
      .then(r=> setUser({...r.data, token}))
      .catch(()=> localStorage.removeItem('token'))
      .finally(()=> setLoading(false))
  },[])

  const login = async (name,password)=>{
    const res = await axios.post('http://localhost:4000/api/auth/login',{name,password})
    localStorage.setItem('token', res.data.token)
    setUser({...res.data.user, token: res.data.token})
    return res.data.user
  }
  const signup = async (name,password)=>{
    const res = await axios.post('http://localhost:4000/api/auth/signup',{name,password})
    localStorage.setItem('token', res.data.token)
    setUser({...res.data.user, token: res.data.token})
    return res.data.user
  }
  const logout = ()=>{
    localStorage.removeItem('token')
    setUser(null)
  }

  return <AuthContext.Provider value={{user,loading,login,signup,logout}}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return React.useContext(AuthContext)
}

export function PrivateRoute({children}){
  const {user,loading} = useAuth()
  if(loading) return <div style={{padding:20}}>Loading...</div>
  if(!user) {
    // redirect to homepage so modal-based auth can be used
    window.location.href = '/'
    return null
  }
  return children
}
