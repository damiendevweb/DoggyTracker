import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAge } from '../hooks/useAge'
import EnablePushButton from '../components/EnablePushButton'
import TestPushButton from '../components/TestPushButton'
import SidebarProfile from '../components/SidebarProfile'

type ScanEvent = {
    id: string
    created_at: string
    meta: {
        address?: string
        latitude?: number
        longitude?: number
        userAgent?: string
        path?: string
    } | null
}

type Animal = {
    id: string
    nom: string
    race: string
    age: number | null
    poids: number
    ok_congenere: boolean
    ok_enfants: boolean
    telephone_1: string
    telephone_2: string | null
    mail_1: string
    mail_2: string | null
    prenom_proprietaire: string
    telephone_veterinaire: string
    created_at: string
    user_id: string | null
    qr_url: string | null
    birth_date?: string
}

const toFormData = (a: Animal): Partial<Animal> => ({
    nom: a.nom,
    race: a.race,
    birth_date: a.birth_date,
    poids: a.poids,
    ok_congenere: a.ok_congenere,
    ok_enfants: a.ok_enfants,
    prenom_proprietaire: a.prenom_proprietaire,
    telephone_1: a.telephone_1,
    telephone_2: a.telephone_2,
    mail_1: a.mail_1,
    mail_2: a.mail_2,
    telephone_veterinaire: a.telephone_veterinaire,
})

export const Dashboard = () => {
    const [animals, setAnimals] = useState<Animal[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState<Partial<Animal>>({})
    const { display: ageDisplay } = useAge(formData.birth_date)
    const [scans, setScans] = useState<ScanEvent[]>([])
    const [scansLoading, setScansLoading] = useState(true)
    const [historyOpen, setHistoryOpen] = useState(false)
    const [openMonths, setOpenMonths] = useState<Set<string>>(new Set())

    const animal = animals.find((a) => a.id === selectedId) ?? animals[0] ?? null

    const scansByMonth = useMemo(() => {
        const groups = new Map<string, { calendarDate: string; items: ScanEvent[] }>()
        for (const scan of scans) {
            const d = new Date(scan.created_at)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            if (!groups.has(key)) {
                groups.set(key, {
                    calendarDate: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
                    items: [],
                })
            }
            groups.get(key)!.items.push(scan)
        }
        return Array.from(groups.entries()).map(([key, { calendarDate, items }]) => ({ key, calendarDate, items }))
    }, [scans])

    const toggleMonth = (key: string) => {
        setOpenMonths(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const fetchAnimals = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('Non connecté')
            setLoading(false)
            return
        }

        const { data, error } = await supabase
            .from('animal')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
        } else {
            setAnimals(data as Animal[] ?? [])
            setSelectedId(prev => (prev && data?.some((a) => a.id === prev) ? prev : (data?.[0]?.id ?? null)))
        }

        setLoading(false)
    }

    const selectAnimal = (id: string) => {
        setSelectedId(id)
        setEditing(false)
        setFormData({})
        setHistoryOpen(false)
        setOpenMonths(new Set())
    }

    useEffect(() => {
        void fetchAnimals()
    }, [])

    useEffect(() => {
        if (!animal?.id) return

        const fetchScans = async () => {
            setScansLoading(true)
            const { data } = await supabase
                .from('animal_access_events')
                .select('id, created_at, meta')
                .eq('animal_id', animal.id)
                .order('created_at', { ascending: false })

            setScans(data ?? [])
            setScansLoading(false)
        }

        void fetchScans()
    }, [animal?.id])

    useEffect(() => {
        if (animal && editing) {
            setFormData(toFormData(animal))
        }
    }, [animal, editing])

    const saveChanges = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!animal?.id) return

        try {
            const { error } = await supabase
                .from('animal')
                .update(formData as Animal)
                .eq('id', animal.id)

            if (error) throw error

            await fetchAnimals()
            setEditing(false)
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Erreur inconnue')
        }
    }

    const cancelEdit = () => {
        setEditing(false)
        setFormData({})
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-sm text-text-muted">Chargement...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center mt-20 text-error p-8 bg-error/10 rounded border border-error/20 text-sm">
                    {error}
                </div>
            </div>
        )
    }

    if (!animal) {
        return (
            <div className="p-6">
                <div className="text-center mt-20 p-8 bg-bg-elevated rounded border border-border text-sm text-text-muted">
                    Aucun animal lié à ton compte.
                </div>
            </div>
        )
    }

    const inputClass = "w-full p-2.5 border border-border rounded text-sm focus:ring-0 focus:border-accent bg-bg-surface text-text-primary"

    return (
        <div className="md:flex flex-1">
            <SidebarProfile />
            <div className="flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                            Mes animaux ({animals.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {animals.map((a) => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => selectAnimal(a.id)}
                                    aria-pressed={a.id === animal.id}
                                    className={`flex items-center gap-2 rounded border px-3 py-2 text-left transition-colors ${
                                        a.id === animal.id
                                            ? 'border-accent bg-accent text-bg'
                                            : 'border-border bg-bg-elevated text-text-secondary hover:border-accent/50 hover:text-text-primary'
                                    }`}
                                >
                                    <span className="text-sm font-medium">{a.nom}</span>
                                    <span className={`font-mono text-[10px] ${a.id === animal.id ? 'text-bg/70' : 'text-text-muted'}`}>
                                        {a.id}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-bg-elevated border border-border rounded p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">

                            <span className="bg-bg-surface text-text-muted px-3 py-1 rounded text-xs border border-border">
                                {animal.id}
                            </span>
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
                                >
                                    Modifier
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveChanges}
                                        className="bg-accent hover:bg-accent-hover text-bg px-5 py-1.5 rounded text-sm font-medium transition-colors"
                                    >
                                        Sauvegarder
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-bg-surface hover:bg-bg-hover text-text-secondary px-5 py-1.5 rounded text-sm font-medium transition-colors border border-border"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={editing ? saveChanges : undefined}>
                        <div className="bg-bg-surface p-5 rounded mb-6 border border-border">
                            {editing ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={formData.nom ?? ''}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className={inputClass}
                                        placeholder="Nom de l'animal"
                                    />
                                    <input
                                        type="text"
                                        value={formData.race ?? ''}
                                        onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                                        className={inputClass}
                                        placeholder="Race de l'animal"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-text-primary">{animal.nom}</h3>
                                    <p className="text-sm text-text-secondary mt-1">{animal.race}</p>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-bg-surface p-5 rounded border border-border">
                                <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Infos physiques</h3>
                                {editing ? (
                                    <div className="space-y-2">
                                        <input type="date" value={formData.birth_date ?? ''} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} className={inputClass} />
                                        <input type="number" step="0.1" value={formData.poids ?? ''} onChange={(e) => setFormData({ ...formData, poids: Number(e.target.value) })} className={inputClass} placeholder="Poids (kg)" />
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-sm">
                                        <p><span className="text-text-muted">Âge :</span> <span className="font-medium text-text-primary">{ageDisplay}</span></p>
                                        <p><span className="text-text-muted">Poids :</span> <span className="font-medium text-text-primary">{animal.poids} kg</span></p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-bg-surface p-5 rounded border border-border">
                                <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Compatibilités</h3>
                                {editing ? (
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={formData.ok_congenere || false} onChange={(e) => setFormData({ ...formData, ok_congenere: e.target.checked })} className="w-4 h-4 rounded border-border bg-bg-surface text-accent focus:ring-accent" />
                                            OK congénères
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={formData.ok_enfants || false} onChange={(e) => setFormData({ ...formData, ok_enfants: e.target.checked })} className="w-4 h-4 rounded border-border bg-bg-surface text-accent focus:ring-accent" />
                                            OK enfants
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${animal.ok_congenere ? 'bg-success/10 text-success border-success/20' : 'bg-bg-elevated text-text-muted border-border'}`}>
                                            {animal.ok_congenere ? '✓ Congénères' : '✗ Congénères'}
                                        </span>
                                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${animal.ok_enfants ? 'bg-success/10 text-success border-success/20' : 'bg-bg-elevated text-text-muted border-border'}`}>
                                            {animal.ok_enfants ? '✓ Enfants' : '✗ Enfants'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-bg-surface p-5 rounded border border-border mb-6">
                            <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Contacts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {editing ? (
                                    <>
                                        <input type="text" value={formData.prenom_proprietaire ?? ''} onChange={(e) => setFormData({ ...formData, prenom_proprietaire: e.target.value })} className={inputClass} placeholder="Prénom propriétaire" />
                                        <input type="tel" value={formData.telephone_1 ?? ''} onChange={(e) => setFormData({ ...formData, telephone_1: e.target.value })} className={inputClass} placeholder="Téléphone 1" />
                                        <input type="email" value={formData.mail_1 ?? ''} onChange={(e) => setFormData({ ...formData, mail_1: e.target.value })} className={inputClass} placeholder="Email 1" />
                                        <input type="tel" value={formData.telephone_veterinaire ?? ''} onChange={(e) => setFormData({ ...formData, telephone_veterinaire: e.target.value })} className={inputClass} placeholder="Téléphone vétérinaire" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm"><span className="text-text-muted">Propriétaire :</span> <span className="font-medium text-text-primary">{animal.prenom_proprietaire}</span></p>
                                        <p className="text-sm">
                                            <span className="text-text-muted">Tél : </span>
                                            <a href={`tel:${animal.telephone_1}`} className="text-accent hover:text-accent-hover font-medium">{animal.telephone_1}</a>
                                            {animal.telephone_2 && <span className="text-text-muted"> · <a href={`tel:${animal.telephone_2}`} className="text-accent hover:text-accent-hover">{animal.telephone_2}</a></span>}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-text-muted">Email : </span>
                                            <a href={`mailto:${animal.mail_1}`} className="text-accent hover:text-accent-hover font-medium">{animal.mail_1}</a>
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-text-muted">Vétérinaire : </span>
                                            <a href={`tel:${animal.telephone_veterinaire}`} className="text-accent hover:text-accent-hover font-medium">{animal.telephone_veterinaire}</a>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Scan history */}
                        <div className="border border-border rounded mb-6">
                            <button
                                type="button"
                                onClick={() => setHistoryOpen(!historyOpen)}
                                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-text-primary hover:bg-bg-hover transition-colors"
                            >
                                <span>Historique de scans</span>
                                <svg
                                    className={`w-4 h-4 shrink-0 text-text-muted transition-transform duration-200 ${historyOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {historyOpen && (
                                <div className="border-t border-border">
                                    {scansLoading ? (
                                        <div className="px-5 py-6 text-center text-xs text-text-muted">
                                            Chargement...
                                        </div>
                                    ) : scans.length === 0 ? (
                                        <div className="px-5 py-6 text-center text-xs text-text-muted">
                                            Aucun scan enregistré pour le moment.
                                        </div>
                                    ) : (
                                        <div>
                                            {scansByMonth.map(({ key, calendarDate, items }) => {
                                                const isOpen = openMonths.has(key)
                                                return (
                                                    <div key={key} className="border-b border-border last:border-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleMonth(key)}
                                                            className="flex w-full items-center justify-between px-5 py-3 text-left text-xs font-semibold text-text-secondary hover:bg-bg-hover transition-colors"
                                                        >
                                                            <span className="capitalize">{calendarDate}</span>
                                                            <span className="flex items-center gap-2">
                                                                <span className="text-[10px] font-normal text-text-muted">{items.length} scan{items.length > 1 ? 's' : ''}</span>
                                                                <svg
                                                                    className={`w-3.5 h-3.5 shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={2}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </span>
                                                        </button>
                                                        {isOpen && (
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full text-sm">
                                                                    <thead>
                                                                        <tr className="border-t border-border">
                                                                            <th className="px-5 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                                                                            <th className="px-5 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Heure</th>
                                                                            <th className="px-5 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Adresse</th>
                                                                            <th className="px-5 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">GPS</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {items.map((scan) => {
                                                                            const d = new Date(scan.created_at)
                                                                            const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                                            const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                            const address = scan.meta?.address ?? null
                                                                            const latitude = scan.meta?.latitude ?? null
                                                                            const longitude = scan.meta?.longitude ?? null
                                                                            return (
                                                                                <tr key={scan.id} className="border-t border-border first:border-0 hover:bg-bg-hover transition-colors">
                                                                                    <td className="px-2 lg:px-5 py-2.5 text-xs text-text-primary">{date}</td>
                                                                                    <td className="px-2 lg:px-5 py-2.5 text-xs text-text-primary">{time}</td>
                                                                                    <td className="px-2 lg:px-5 py-2.5 text-xs text-text-secondary">
                                                                                        {address ? (
                                                                                            <a
                                                                                                href={`https://www.google.fr/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="inline-flex items-center gap-1 hover:text-sage-700 transition-colors"
                                                                                            >
                                                                                                {address}
                                                                                                <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                                                </svg>
                                                                                            </a>
                                                                                        ) : (
                                                                                            <span className="text-text-muted italic">Non communiquée</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-2 lg:px-5 py-2.5 text-xs text-text-secondary">
                                                                                        {latitude != null && longitude != null ? (
                                                                                            <a
                                                                                                href={`https://www.google.fr/maps/dir/?api=1&destination=${latitude},${longitude}`}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="inline-flex items-center gap-1 hover:text-sage-700 transition-colors"
                                                                                            >
                                                                                                {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                                                                                <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                                                </svg>
                                                                                            </a>
                                                                                        ) : (
                                                                                            <span className="text-text-muted italic">—</span>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <EnablePushButton />
                            <TestPushButton />
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}