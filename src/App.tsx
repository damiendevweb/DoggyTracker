import { Routes, Route, Navigate } from 'react-router-dom'

import { useAuth } from './hooks/useAuth'
import { AuthPage } from './pages/AuthPage'
import { AnimalPage } from './pages/AnimalPage'
import { HomePage } from './pages/HomePage'
import { Dashboard } from './pages/Dashboard'
import { GenerateQR } from './pages/GenerateQR'
import { ResetPasswordPage } from './pages/ResetPagePassword'
import { NavigationBar } from './components/NavigationBar'
import { ProfilePage } from './pages/Profile'
import { Footer } from './components/Footer'
import { Contact } from './pages/Contact'

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
    <div className="min-h-screen bg-light-grey flex flex-col">
      <NavigationBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={
          user ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path='generate-qr-code' element={<GenerateQR />} />
        <Route path='contact' element={<Contact />} />

        <Route path="/:animalId" element={<AnimalPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
