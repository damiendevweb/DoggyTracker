import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const NavigationBar = () => {
  const { user } = useAuth()


  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        aria-label="Navigation principale"
      >
        <Link to="/">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            DoggyTracker
          </h1>
        </Link>

        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="2 1 12 14"
                className="h-4 w-4"
                fill="none"
                aria-hidden="true"
              >
                <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="currentColor" />
                <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="currentColor" />
              </svg>
            </span>
            <span>Mon profil</span>
          </Link>
        )}
      </nav>
    </header>
  )
}