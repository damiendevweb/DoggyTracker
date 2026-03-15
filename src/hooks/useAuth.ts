import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupère la session existante au montage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écoute les changements (connexion, déconnexion, expiration)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

const signUp = async (email: string, password: string, prenom: string, animalId: string) => {
  // Vérifie d'abord que l'animal existe et n'est pas lié
  const { data: animal } = await supabase
    .from('animal')
    .select('id, user_id')
    .eq('id', animalId)
    .single()

  if (!animal) throw new Error('ID animal invalide')
  if (animal.user_id) throw new Error('Cet animal est déjà lié à un compte')

  // Puis inscription
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { prenom, animal_id: animalId }
    }
  })
  if (error) throw error
  return data.user
}
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data.user
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signUp, signIn, signOut }
}
