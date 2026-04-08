import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function SidebarProfile() {
  const location = useLocation()
  const { signOut } = useAuth()
    
  const linkClass = (path: string) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      location.pathname === path
        ? 'bg-slate-900 text-white'
        : 'text-slate-700 hover:bg-slate-100'
    }`

  return (
    <aside className="w-full border-r bg-white p-4 md:min-h-screen md:w-72">
      <nav className="space-y-2" aria-label="Navigation profil">
        <Link to="/profile" className={linkClass('/profile')}>
          Mon profil
        </Link>

        <Link to="/profile/achats" className={linkClass('/profile/achats')}>
          Mes achats
        </Link>

        <Link to="/dashboard" className={linkClass('/dashboard')}>
          Mon animal
        </Link>

        <button
          type="button"
          onClick={signOut}
          className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Déconnexion
        </button>
      </nav>
    </aside>
  )
}