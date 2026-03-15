import { useEffect, useState } from 'react'
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

export const Dashboard = () => {
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMonAnimal = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Non connecté')
        setLoading(false)
        return
      }

      // Récupère profile → animal_id → animal
      const { data: profile } = await supabase
        .from('profile')
        .select('animal_id')
        .eq('id', user.id)
        .single()

      if (!profile?.animal_id) {
        setError('Aucun animal lié à ton compte')
        setLoading(false)
        return
      }

      // Récupère l'animal
      const { data: animalData, error } = await supabase
        .from('animal')
        .select('*')
        .eq('id', profile.animal_id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setAnimal(animalData)
      }

      setLoading(false)
    }

    fetchMonAnimal()
  }, [])

  if (loading) return <div className="flex justify-center items-center h-64"><span className="text-lg">Chargement de ton animal...</span></div>
  if (error) return <div className="text-center mt-20 text-red-500 p-8 bg-red-50 rounded-lg">{error}</div>
  if (!animal) return <div className="text-center mt-20 p-8 bg-yellow-50 rounded-lg">Aucun animal lié à ton compte.</div>

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{animal.nom}</h1>
            <p className="text-xl text-gray-600">{animal.race}</p>
          </div>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-mono">
            {animal.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3">📊 Infos physiques</h3>
            <p><span className="font-medium">Âge :</span> {animal.age} ans</p>
            <p><span className="font-medium">Poids :</span> {animal.poids} kg</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3">👥 Compatibilités</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm mr-2 mb-2 ${
              animal.ok_congenere 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {animal.ok_congenere ? '✓ Congénères' : '✗ Congénères'}
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              animal.ok_enfants 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {animal.ok_enfants ? '✓ Enfants' : '✗ Enfants'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">📞 Contacts</h3>
          <div className="space-y-2 text-sm">
            <p>👤 <strong>{animal.prenom_proprietaire}</strong></p>
            <p>📱 {animal.telephone_1} {animal.telephone_2 && `| ${animal.telephone_2}`}</p>
            <p>✉️ {animal.mail_1} {animal.mail_2 && `| ${animal.mail_2}`}</p>
            <p>🏥 Vétérinaire : <strong>{animal.telephone_veterinaire}</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
