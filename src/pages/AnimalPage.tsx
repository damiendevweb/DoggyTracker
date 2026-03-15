import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Animal = {
  id: string
  nom: string
  race: string
  age: number
  poids: number
  ok_congenere: boolean
  ok_enfants: boolean
  telephone_1: string
  telephone_2: string | null
  mail_1: string
  mail_2: string | null
  prenom_proprietaire: string
  telephone_veterinaire: string
}

export const AnimalPage = () => {
  const { animalId } = useParams<{ animalId: string }>()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!animalId) return

    const fetchAnimal = async () => {
      const { data, error } = await supabase
        .from('animal')
        .select('*')
        .eq('id', animalId.toUpperCase())
        .single()

      if (error && error.code !== 'PGRST116') {  // PGRST116 = pas trouvé
        setError('Erreur de chargement')
      } else if (!data) {
        setError('Animal non trouvé')
      } else {
        setAnimal(data)
      }

      setLoading(false)
    }

    fetchAnimal()
  }, [animalId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement de {animalId?.toUpperCase()}</p>
        </div>
      </div>
    )
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🐶 {animalId?.toUpperCase()}</h1>
          <p className="text-xl text-gray-500 mb-8">{error || 'Animal introuvable'}</p>
          <p className="text-sm text-gray-400">
            Vérifie l'ID ou{' '}
            <a href="/" className="text-blue-600 hover:underline font-medium">
              retourne au dashboard
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{animal.nom}</h1>
            <p className="text-xl text-gray-600">{animal.race}</p>
          </div>
          <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-lg font-mono uppercase tracking-wider">
            {animal.id}
          </span>
        </div>
        {/* Même rendu que Dashboard mais sans navbar */}
        {/* ... copie le reste du JSX de Dashboard */}
      </div>
    </div>
  )
}
