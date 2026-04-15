import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, prenom: string, animalId: string) => {
    const { data: animal } = await supabase
      .from('animal')
      .select('id, user_id')
      .eq('id', animalId)
      .single()

    if (!animal) throw new Error('ID de l\'animal invalide')
    if (animal.user_id) throw new Error('Cet animal est déjà lié à un compte')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { prenom, animal_id: animalId }
      }
    })
    if (error) throw error
    window.location.href = '/dashboard';
    return data.user
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    window.location.href = '/dashboard';
    return data.user
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signUp, signIn, signOut }
}
