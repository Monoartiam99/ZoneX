import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Tournament from './pages/Tournament'
import Wallet from './pages/Wallet'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'
import Login from './pages/Login'
import './styles.css'
import { AuthProvider, PrivateRoute } from './auth'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
        <Route path="/tournaments" element={<PrivateRoute><Tournaments/></PrivateRoute>} />
        <Route path="/tournament/:id" element={<PrivateRoute><Tournament/></PrivateRoute>} />
        <Route path="/wallet" element={<PrivateRoute><Wallet/></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard/></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
