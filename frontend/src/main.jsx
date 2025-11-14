import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Tournament from './pages/Tournament'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'
import './styles.css'
import { AuthProvider, PrivateRoute } from './auth'

function App( ){
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages: Home, Tournaments, Tournament details, Leaderboard */}
        <Route path="/" element={<Home/>} />
        <Route path="/tournaments" element={<Tournaments/>} />
        <Route path="/tournament/:id" element={<Tournament/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        {/* Admin stays protected */}
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
