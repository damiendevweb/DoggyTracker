import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from './hooks/useAuth'
import { AuthPage } from './pages/AuthPage'
import { AnimalPage } from './pages/AnimalPage'
import { HomePage } from './pages/HomePage'
import { Dashboard } from './pages/Dashboard'
import { GenerateQR } from './pages/GenerateQR'
import { ResetPasswordPage } from './pages/ResetPagePassword'
import { ScrollToTop } from './components/ScrollToTop'
import { NavigationBar } from './components/NavigationBar'
import { TopInfoBanner } from './components/TopInfoBanner'
import { ProfilePage } from './pages/Profile'
import { Footer } from './components/Footer'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { Contact } from './pages/Contact'
import { ProductList } from './pages/ProductsList'
import { ProductPage } from './pages/ProductPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { NotreHistoire } from './pages/NotreHistoire'
import { LeConcept } from './pages/LeConcept'
import { ToastProvider } from './components/Toast'

function App() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    )
  }

  const showPWA = (location.pathname === '/dashboard' || location.pathname === '/profile') && user

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <TopInfoBanner />
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
          <Route path='categorie/medaille-gravee' element={<ProductList />} />
          <Route path='produit/:slug' element={<ProductPage />} />
          <Route path='generate-qr-code' element={<GenerateQR />} />
          <Route path='contact' element={<Contact />} />
          <Route path='notre-histoire' element={<NotreHistoire />} />
          <Route path='le-concept' element={<LeConcept />} />
          <Route path='blog/:slug' element={<BlogPostPage />} />

          <Route path="/:animalId" element={<AnimalPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {showPWA && <PWAInstallPrompt />}
        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App
