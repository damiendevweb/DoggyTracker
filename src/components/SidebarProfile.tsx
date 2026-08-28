import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function SidebarProfile() {
  const location = useLocation()
  const { signOut } = useAuth()

  const linkClass = (path: string) =>
    `block px-3 py-2 text-xs font-medium transition-colors rounded ${
      location.pathname === path
        ? 'bg-accent text-bg'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
    }`

  return (
    <aside className="w-full border-r border-border bg-bg-elevated p-4 md:min-h-screen md:w-56">
      <nav className="space-y-0.5" aria-label="Navigation profil">
        <Link to="/profile" className={linkClass('/profile')}>
          Mon profil
        </Link>
        <Link to="/dashboard" className={linkClass('/dashboard')}>
          Mon animal
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="block w-full px-3 py-2 text-left text-xs font-medium text-error rounded hover:bg-error/10 transition-colors"
        >
          Déconnexion
        </button>
      </nav>
    </aside>
  )
}
