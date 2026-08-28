import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAge } from '../hooks/useAge'
import EnablePushButton from '../components/EnablePushButton'
import TestPushButton from '../components/TestPushButton'
import SidebarProfile from '../components/SidebarProfile'

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

export const Dashboard = () => {
    const [animal, setAnimal] = useState<Animal | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState<Partial<Animal>>({})
    const { display: ageDisplay } = useAge(formData.birth_date)

    const fetchAnimal = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('Non connecté')
            setLoading(false)
            return
        }

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

    useEffect(() => {
        fetchAnimal()
    }, [])

    useEffect(() => {
        if (animal && editing) {
            setFormData(animal)
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

            await fetchAnimal()
            setEditing(false)
        } catch (error: any) {
            setError(error.message)
        }
    }

    const cancelEdit = () => {
        setEditing(false)
        setFormData({})
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-bg">
                <p className="text-sm text-text-muted">Chargement...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-bg min-h-screen p-6">
                <div className="text-center mt-20 text-error p-8 bg-error/10 rounded border border-error/20 text-sm">
                    {error}
                </div>
            </div>
        )
    }

    if (!animal) {
        return (
            <div className="bg-bg min-h-screen p-6">
                <div className="text-center mt-20 p-8 bg-bg-elevated rounded border border-border text-sm text-text-muted">
                    Aucun animal lié à ton compte.
                </div>
            </div>
        )
    }

    const inputClass = "w-full p-2.5 border border-border rounded text-sm focus:ring-0 focus:border-accent bg-bg-surface text-text-primary"

    return (
        <div className="min-h-screen bg-bg md:flex">
            <SidebarProfile />
            <div className="flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-2xl bg-bg-elevated border border-border rounded p-8">
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

                        <div className="space-y-4">
                            <EnablePushButton />
                            <TestPushButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
