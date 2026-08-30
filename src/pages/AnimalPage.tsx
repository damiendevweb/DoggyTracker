import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { reverseGeocode } from '../lib/reverse-geocoding'
import { useGeolocation } from '../hooks/useGeolocation'
import { useAge } from '../hooks/useAge'
import { useToast } from '../components/Toast'

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

const LOCATION_TIMEOUT_MS = 8_000
const TOAST_DELAY_MS = 8_000

export const AnimalPage = () => {
    const { animalId } = useParams<{ animalId: string }>()
    const [animal, setAnimal] = useState<Animal | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [formData,] = useState<Partial<Animal>>({})
    const hasSentAccessEvent = useRef(false)
    const toastShownRef = useRef(false)
    const manualNotifyPending = useRef(false)

    const { display: ageDisplay } = useAge(formData.birth_date)
    const { getLocationPromise } = useGeolocation()
    const { showToast } = useToast()

    const normalizedAnimalId = animalId?.toUpperCase() ?? ''
    const isFicheEmpty = animal && (!animal.nom || animal.nom.trim() === '')

    const logAnimalAccess = async (id: string, meta: AccessMeta) => {
        try {
            if (typeof window === 'undefined') return

            const { error } = await supabase.from('animal_access_events').insert({
                animal_id: id,
                event_type: 'scan',
                source: 'public_animal_page',
                meta,
            })

            if (error) {
                console.error('Erreur insert animal_access_events:', error)
            }
        } catch (e) {
            console.error('Erreur logAnimalAccess:', e)
        }
    }

    const sendNotificationWithLocation = async (meta: AccessMeta) => {
        if (!animal?.id) return
        await logAnimalAccess(animal.id, meta)
    }

    const baseMeta: AccessMeta = {
        from: 'url',
        path: window.location.pathname,
        userAgent: navigator.userAgent,
    }

    const requestLocationAndNotify = async () => {
        const geo = await getLocationPromise(LOCATION_TIMEOUT_MS)
        if (!geo) return

        const latlng = { latitude: geo.latitude, longitude: geo.longitude }

        try {
            const addr = await Promise.race([
                reverseGeocode(geo.latitude, geo.longitude),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), 4000)
                ),
            ])
            await sendNotificationWithLocation({ ...baseMeta, ...latlng, address: addr.shortAddress })
        } catch {
            await sendNotificationWithLocation({ ...baseMeta, ...latlng })
        }
    }

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
        return () => { cancelled = true }
    }, [normalizedAnimalId])

    useEffect(() => {
        if (!animal?.id) return
        if (typeof window === 'undefined') return
        if (hasSentAccessEvent.current) return

        hasSentAccessEvent.current = true

        const baseMeta: AccessMeta = {
            from: 'url',
            path: window.location.pathname,
            userAgent: navigator.userAgent,
        }

        sendNotificationWithLocation(baseMeta)

        const toastTimer = setTimeout(() => {
            if (toastShownRef.current) return
            toastShownRef.current = true

            showToast({
                message: 'Le propriétaire a été notifié que vous avez trouvé son animal. Accepteriez-vous de partager votre localisation temporairement pour l\'aider à vous rejoindre plus rapidement ?',
                type: 'info',
                duration: 0,
                action: {
                    label: 'Oui, partager',
                    onClick: () => {
                        requestLocationAndNotify()
                    }
                },
                secondaryAction: {
                    label: 'Non',
                    onClick: () => {}
                }
            })
        }, TOAST_DELAY_MS)

        return () => clearTimeout(toastTimer)
    }, [animal?.id, getLocationPromise, showToast])

    const handleManualNotify = async () => {
        if (manualNotifyPending.current) return
        manualNotifyPending.current = true

        const geo = await getLocationPromise(LOCATION_TIMEOUT_MS)
        manualNotifyPending.current = false

        if (!geo) {
            showToast({
                message: 'Vous devez accepter le partage temporaire de votre localisation pour prévenir le propriétaire',
                type: 'warning',
                duration: 5000
            })
            return
        }

        const latlng = { latitude: geo.latitude, longitude: geo.longitude }
        const manualMeta = { ...baseMeta, from: 'manual_button' as const }

        try {
            const addr = await Promise.race([
                reverseGeocode(geo.latitude, geo.longitude),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), 4000)
                ),
            ])
            await sendNotificationWithLocation({ ...manualMeta, ...latlng, address: addr.shortAddress })
            showToast({ message: 'Propriétaire prévenu avec votre localisation', type: 'success' })
        } catch {
            await sendNotificationWithLocation({ ...manualMeta, ...latlng })
            showToast({ message: 'Propriétaire prévenu', type: 'success' })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <div className="text-center">
                    <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin mx-auto mb-3" />
                    <p className="text-sm text-text-muted">{normalizedAnimalId}</p>
                </div>
            </div>
        )
    }

    if (error || !animal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <div className="text-center p-8 max-w-md">
                    <span className="text-4xl block mb-4">🐶</span>
                    <h2 className="font-unbounded text-2xl font-bold text-text-primary mb-2">{normalizedAnimalId}</h2>
                    <p className="text-sm text-text-secondary mb-6">{error || 'Animal introuvable'}</p>
                    <p className="text-sm text-text-muted">
                        Vérifie l'ID ou{' '}
                        <Link to="/" className="text-accent hover:text-accent-hover font-medium">retourne à l'accueil</Link>
                    </p>
                </div>
            </div>
        )
    }

    if (isFicheEmpty) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 text-center bg-bg">
                <div className="max-w-md p-8 bg-bg-elevated rounded border border-border">
                    <div className="w-14 h-14 bg-accent-dim rounded mx-auto mb-5 flex items-center justify-center">
                        <span className="text-2xl">🐕</span>
                    </div>
                    <h2 className="font-unbounded text-xl font-bold text-text-primary mb-3">
                        Fiche {normalizedAnimalId}
                    </h2>
                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                        La fiche de ce chien <strong className="text-text-primary">n'est pas encore remplie</strong>. C'est le vôtre ?
                    </p>
                    <div className="bg-bg-surface rounded p-3 mb-6 border border-border">
                        <p className="text-xs font-medium text-text-secondary">
                            Inscris-toi pour remplir sa fiche complète
                        </p>
                    </div>
                    <a
                        href={`/login?mode=signup&animal=${normalizedAnimalId}`}
                        className="inline-block w-full bg-accent hover:bg-accent-hover text-bg font-semibold text-sm py-3 px-6 rounded transition-all text-center"
                    >
                        Remplir ma fiche
                    </a>
                    <p className="text-xs text-text-muted mt-5 bg-bg-surface px-3 py-1 rounded inline-block border border-border">
                        ID: {normalizedAnimalId}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg py-12">
            <div className="max-w-2xl mx-auto px-5">
                <div className="bg-bg-elevated border border-border overflow-hidden">
                    <div className="bg-accent p-8 text-bg text-center">
                        <h1 className="font-unbounded text-2xl font-bold">{animal.nom}</h1>
                        <p className="text-bg/80 text-sm mt-1">{animal.race}</p>
                        <span className="inline-block mt-3 bg-bg/20 rounded px-2.5 py-1 text-xs">
                            {animal.id}
                        </span>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded overflow-hidden">
                            <div className="bg-bg-elevated p-5">
                                <h3 className="font-semibold text-text-muted mb-3 text-xs uppercase tracking-wider">Infos physiques</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-text-muted">Âge</span><span className="font-medium text-text-primary">{ageDisplay}</span></p>
                                    <p className="flex justify-between"><span className="text-text-muted">Poids</span><span className="font-medium text-text-primary">{animal.poids} kg</span></p>
                                </div>
                            </div>

                            <div className="bg-bg-elevated p-5">
                                <h3 className="font-semibold text-text-muted mb-3 text-xs uppercase tracking-wider">Compatibilités</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border ${animal.ok_congenere ? 'bg-success/10 text-success border-success/20' : 'bg-bg-surface text-text-muted border-border'}`}>
                                        {animal.ok_congenere ? '✓ Congénères' : '✗ Congénères'}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border ${animal.ok_enfants ? 'bg-success/10 text-success border-success/20' : 'bg-bg-surface text-text-muted border-border'}`}>
                                        {animal.ok_enfants ? '✓ Enfants' : '✗ Enfants'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-bg-elevated rounded border border-border p-5">
                            <h3 className="font-semibold text-text-muted mb-3 text-xs uppercase tracking-wider">Contacts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-text-muted text-xs">Propriétaire</p>
                                    <p className="font-medium text-text-primary">{animal.prenom_proprietaire}</p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs">Téléphone</p>
                                    <p className="font-medium">
                                        <a href={`tel:${animal.telephone_1}`} className="text-accent hover:text-accent-hover">
                                            {animal.telephone_1}
                                        </a>
                                        {animal.telephone_2 && (
                                            <> · <a href={`tel:${animal.telephone_2}`} className="text-accent hover:text-accent-hover opacity-80">{animal.telephone_2}</a></>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs">Email</p>
                                    <p className="font-medium">
                                        <a href={`mailto:${animal.mail_1}`} className="text-accent hover:text-accent-hover">
                                            {animal.mail_1}
                                        </a>
                                        {animal.mail_2 && (
                                            <> · <a href={`mailto:${animal.mail_2}`} className="text-accent hover:text-accent-hover opacity-80">{animal.mail_2}</a></>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs">Vétérinaire</p>
                                    <p className="font-medium">
                                        <a href={`tel:${animal.telephone_veterinaire}`} className="text-accent hover:text-accent-hover">
                                            {animal.telephone_veterinaire}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleManualNotify}
                            disabled={manualNotifyPending.current}
                            className="w-full bg-accent hover:bg-accent-hover text-bg font-semibold text-sm py-2.5 rounded transition-colors disabled:opacity-50"
                        >
                            {manualNotifyPending.current ? 'Localisation en cours...' : 'Prévenir le propriétaire que vous avez retrouvé son animal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}