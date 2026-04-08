import { useEffect, useState } from 'react'
import SidebarProfile from '../components/SidebarProfile'
import { supabase } from '../lib/supabase'

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
        Chargement du profil...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <SidebarProfile />

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold text-slate-900">Mon profil</h1>

          <div className="grid gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Prénom</p>
              <p className="text-base font-medium text-slate-900">{profile?.prenom || '—'}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-base font-medium text-slate-900">{profile?.email || '—'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}