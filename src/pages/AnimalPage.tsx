import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useGeolocation } from '../hooks/useGeolocation'

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
    const { latitude: lat, longitude: lng, getLocation } = useGeolocation()
    const isFicheEmpty = animal && (!animal.nom || animal.nom.trim() === '');

    useEffect(() => {
        getLocation()
    }, [])

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
    if (isFicheEmpty) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="max-w-md p-8 bg-white rounded-3xl shadow-2xl border-4 border-dashed border-yellow-200">
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-white">🐕</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Fiche {animalId?.toUpperCase()}
                    </h1>

                    <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                        La fiche de ce chien <strong>n'est pas encore remplie</strong>.<br />
                        <span className="text-orange-600 font-semibold">Est-ce bien le vôtre ?</span>
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                            <p className="text-sm font-medium text-orange-800">
                                👆 <strong>Inscrivez-vous ici</strong> pour remplir sa fiche complète
                            </p>
                        </div>
                        <p className="text-xs text-gray-500">
                            Nom, race, âge, contacts, vétérinaire...
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href={`/login?mode=signup&animal=${animalId}`}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-orange-500/25 transition-all text-center"
                        >
                            ✍️ Remplir ma fiche
                        </a>

                    </div>

                    <p className="text-xs text-gray-400 mt-6 font-mono bg-gray-50 px-3 py-1 rounded-full inline-block">
                        ID: {animalId?.toUpperCase()}
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border mb-8">
                <div className="flex justify-between items-start mb-6">
                    {loading ? (
                        <p className="text-blue-500 p-3 bg-blue-50 rounded-lg font-mono">🔍 Localisation...</p>
                    ) : error ? (
                        <p className="text-red-500 p-3 bg-red-50 rounded-lg font-mono">⚠️ {error}</p>
                    ) : lat != null && lng != null ? (
                        <p className="text-green-600 p-4 bg-green-50 rounded-lg font-mono">
                            📍 {lat.toFixed(6)}, {lng.toFixed(6)}
                        </p>
                    ) : (
                        <p className="text-gray-500 p-3 bg-gray-50 rounded-lg font-mono">📍 Non disponible</p>
                    )}
                </div>
                <div className="max-w-2xl mx-auto p-8">
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
                            <span className={`inline-block px-3 py-1 rounded-full text-sm mr-2 mb-2 ${animal.ok_congenere
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {animal.ok_congenere ? '✓ Congénères' : '✗ Congénères'}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${animal.ok_enfants
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
        </div>
    )
}
