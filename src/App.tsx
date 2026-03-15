import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { AuthPage } from './pages/AuthPage'
// import { Dashboard } from './pages/Dashboard'
import { AnimalPage } from './pages/AnimalPage'

function App() {
  const { user, loading } = useAuth()

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
          <a href="/" className="text-red-500 underline hover:text-red-700">
            Dashboard
          </a>
        </nav>
      )}
      
      <Routes>
        {/* <Route 
          path="/" 
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        /> */}
        <Route path="/:animalId" element={<AnimalPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </div>
  )
}

export default App
