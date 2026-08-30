import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import SidebarProfile from '../components/SidebarProfile'

type ProfileData = {
  prenom: string
  email: string
}

export const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Utilisateur non connecté')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profile')
        .select('prenom, email')
        .eq('id', user.id)
        .single()

      if (error) {
        setError("Impossible de récupérer les informations du profil.")
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-text-muted">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-5 min-h-screen">
        <div className="rounded bg-error/10 border border-error/20 p-4 text-sm text-error">{error}</div>
      </div>
    )
  }

  return (
    <div className="md:flex flex-1">
      <SidebarProfile />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-2xl bg-bg-elevated border border-border rounded p-8">
          <h1 className="font-unbounded mb-6 text-xl font-bold text-text-primary">Mon profil</h1>
          <div className="space-px bg-border rounded overflow-hidden">
            <div className="bg-bg-surface p-4">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Prénom</p>
              <p className="text-sm font-medium text-text-primary mt-1">{profile?.prenom || '—'}</p>
            </div>
            <div className="bg-bg-surface p-4">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-text-primary mt-1">{profile?.email || '—'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
