import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useGeolocation } from '../hooks/useGeolocation'
import { useReverseGeocoding } from '../hooks/useReverseGeocoding'
import { useAge } from '../hooks/useAge'


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
    birth_date?: string
}

type AccessMeta = {
    from: string
    path: string
    userAgent: string
    latitude?: number
    longitude?: number
    address?: string
}

export const AnimalPage = () => {
    const { animalId } = useParams<{ animalId: string }>()
    const [animal, setAnimal] = useState<Animal | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [formData,] = useState<Partial<Animal>>({})

    const { display: ageDisplay } = useAge(formData.birth_date)


    const {
        latitude: lat,
        longitude: lng,
        getLocation,
        error: geoError,
    } = useGeolocation()

    const {
        address,
        loading: addressLoading,
        error: addressError,
    } = useReverseGeocoding(lat ?? null, lng ?? null)

    const normalizedAnimalId = animalId?.toUpperCase() ?? ''
    const isFicheEmpty = animal && (!animal.nom || animal.nom.trim() === '')

    const logAnimalAccess = async (id: string, meta: AccessMeta) => {
        try {
            if (typeof window === 'undefined') return

            const key = `animal-access:${id}`
            const now = Date.now()
            const last = sessionStorage.getItem(key)

            if (last && now - Number(last) < 2 * 60 * 1000) {
                return
            }

            const { error } = await supabase.from('animal_access_events').insert({
                animal_id: id,
                event_type: 'scan',
                source: 'public_animal_page',
                meta,
            })

            if (error) {
                console.error('Erreur insert animal_access_events:', error)
                return
            }

            sessionStorage.setItem(key, String(now))
        } catch (e) {
            console.error('Erreur logAnimalAccess:', e)
        }
    }

    useEffect(() => {
        void getLocation()
    }, [getLocation])

    useEffect(() => {
        if (!normalizedAnimalId) return

        let cancelled = false

        const fetchAnimal = async () => {
            setLoading(true)
            setError(null)

            const { data, error } = await supabase
                .from('animal')
                .select('*')
                .eq('id', normalizedAnimalId)
                .single()

            if (cancelled) return

            if (error && error.code !== 'PGRST116') {
                setError('Erreur de chargement')
                setAnimal(null)
            } else if (!data) {
                setError('Animal non trouvé')
                setAnimal(null)
            } else {
                setAnimal(data)
            }

            setLoading(false)
        }

        void fetchAnimal()

        return () => {
            cancelled = true
        }
    }, [normalizedAnimalId])

    useEffect(() => {
        if (!animal?.id) return
        if (typeof window === 'undefined') return

        const key = `animal-access:${animal.id}`
        const last = sessionStorage.getItem(key)
        const now = Date.now()

        if (last && now - Number(last) < 2 * 60 * 1000) {
            return
        }

        let cancelled = false

        const sendWithBestAvailableData = async () => {
            if (cancelled) return

            const meta: AccessMeta = {
                from: 'url',
                path: window.location.pathname,
                userAgent: navigator.userAgent,
                latitude: lat ?? undefined,
                longitude: lng ?? undefined,
                address: address?.shortAddress ?? undefined,
            }

            await logAnimalAccess(animal.id, meta)
        }

        if (address?.shortAddress) {
            void sendWithBestAvailableData()
            return
        }

        if (geoError) {
            void sendWithBestAvailableData()
            return
        }

        const timeoutId = window.setTimeout(() => {
            void sendWithBestAvailableData()
        }, 4000)

        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [animal?.id, lat, lng, address?.shortAddress, geoError])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Chargement de {normalizedAnimalId}</p>
                </div>
            </div>
        )
    }

    if (error || !animal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        🐶 {normalizedAnimalId}
                    </h2>
                    <p className="text-xl text-gray-500 mb-8">{error || 'Animal introuvable'}</p>
                    <p className="text-sm text-gray-400">
                        Vérifier l'ID ou{' '}
                        <Link to="/" className="underline hover:opacity-70 font-medium">retourner sur la page d'accueil</Link>
                    </p>
                </div>
            </div>
        )
    }

    if (isFicheEmpty) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center bg-linear-to-br from-yellow-50 to-orange-50">
                <div className="max-w-md p-8 bg-white rounded-3xl shadow-2xl border-4 border-dashed border-yellow-200">
                    <div className="w-24 h-24 bg-linear-to-r from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-white">🐕</span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Fiche {normalizedAnimalId}
                    </h2>

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
                            href={`/login?mode=signup&animal=${normalizedAnimalId}`}
                            className="flex-1 bg-linear-to-r from-orange-500 to-yellow-500from-orange-600to-yellow-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xlshadow-orange-500/25 transition-all text-center"
                        >
                            ✍️ Remplir ma fiche
                        </a>
                    </div>

                    <p className="text-xs text-gray-400 mt-6 font-mono bg-gray-50 px-3 py-1 rounded-full inline-block">
                        ID: {normalizedAnimalId}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border mb-8">
                <div className="flex flex-col gap-2 mb-6">

                    {addressLoading ? (
                        <p className="text-blue-500 p-3 bg-blue-50 rounded-lg text-sm">
                            🔍 Résolution de l'adresse...
                        </p>
                    ) : address?.shortAddress ? (
                        <p className="text-gray-700 p-4 bg-white rounded-lg border text-sm">
                            📬 {address.shortAddress}
                        </p>
                    ) : null}

                    {addressError && (
                        <p className="text-orange-500 p-3 bg-orange-50 rounded-lg text-sm">
                            ⚠️ Adresse introuvable : {addressError}
                        </p>
                    )}
                </div>

                <div className="max-w-2xl mx-auto p-8">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-mono">
                        {animal.id}
                    </span>
                    <div className='bg-white p-6 rounded-xl shadow-sm mb-8'>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{animal.nom}</h2>
                        <p className="text-xl text-gray-600">{animal.race}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-3">📊 Infos physiques</h3>
                            <p>
                                <span className="font-medium">Âge :</span> {ageDisplay}
                            </p>
                            <p>
                                <span className="font-medium">Poids :</span> {animal.poids} kg
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-3">👥 Compatibilités</h3>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm mr-2 mb-2 ${animal.ok_congenere
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {animal.ok_congenere ? '✓ Congénères' : '✗ Congénères'}
                            </span>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm ${animal.ok_enfants ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {animal.ok_enfants ? '✓ Enfants' : '✗ Enfants'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-4">📞 Contacts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p>
                                👤 <strong>{animal.prenom_proprietaire}</strong>
                            </p>
                            <p>
                                📱 <a href={`tel:${animal.telephone_1}`} className="underline hover:opacity-70">
                                    {animal.telephone_1}
                                </a>
                                {animal.telephone_2 && (
                                    <>
                                        {' | '}
                                        <a href={`tel:${animal.telephone_2}`} className="underline hover:opacity-70 opacity-80">
                                            {animal.telephone_2}
                                        </a>
                                    </>
                                )}
                            </p>
                            <p>
                                ✉️{' '}
                                <a href={`mailto:${animal.mail_1}`} className="underline hover:opacity-70">
                                    {animal.mail_1}
                                </a>
                                {animal.mail_2 && (
                                    <>
                                        {' | '}
                                        <a href={`mailto:${animal.mail_2}`} className="underline hover:opacity-70">
                                            {animal.mail_2}
                                        </a>
                                    </>
                                )}
                            </p>
                            <p>
                                🏥 Vétérinaire :{' '}
                                <a href={`tel:${animal.telephone_veterinaire}`} className="underline hover:opacity-70">
                                    {animal.telephone_veterinaire}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}