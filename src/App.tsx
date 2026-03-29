import { Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { useAuth } from './hooks/useAuth'
import { AuthPage } from './pages/AuthPage'
import { AnimalPage } from './pages/AnimalPage'
import { HomePage } from './pages/HomePage'
import { Dashboard } from './pages/Dashboard'
import { GenerateQR } from './pages/GenerateQR'
import { ResetPasswordPage } from './pages/ResetPagePassword'

function App() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <nav className="flex justify-between p-4 bg-white shadow-sm sticky top-0 z-50">
          <span>👋 {user.user_metadata?.prenom || 'Utilisateur'}</span>
          <div className="flex gap-4">
            <button onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button onClick={signOut}>Déconnexion</button>
          </div>
        </nav>
      )}
      
      <Routes>
        <Route path="/manifest.webmanifest" element={<Navigate to="/" replace />} />
        <Route path="/favicon.ico" element={<Navigate to="/" replace />} />
        <Route path="/icons/*" element={<Navigate to="/" replace />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={
          user ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path='generate-qr-code' element={<GenerateQR />} />

        <Route path="/:animalId" element={<AnimalPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
