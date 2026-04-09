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
            <div className="flex justify-center items-center h-64">
                <span className="text-lg">Chargement de ton animal...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center mt-20 text-red-500 p-8 bg-red-50 rounded-lg">
                {error}
            </div>
        )
    }

    if (!animal) {
        return (
            <div className="text-center mt-20 p-8 bg-yellow-50 rounded-lg">
                Aucun animal lié à ton compte.
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 md:flex">
            <SidebarProfile />
            <div className="flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2">
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-mono">
                                {animal.id}
                            </span>
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                                >
                                    ✏️ Modifier
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveChanges}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-semibold"
                                    >
                                        💾 Sauvegarder
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold"
                                    >
                                        ❌ Annuler
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={editing ? saveChanges : undefined}>
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                            {editing ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={formData.nom ?? ''}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nom de l'animal"
                                    />
                                    <input
                                        type="text"
                                        value={formData.race ?? ''}
                                        onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Race de l'animal"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{animal.nom}</h3>
                                    <p className="text-xl text-gray-600">{animal.race}</p>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="font-semibold mb-3">📊 Infos physiques</h3>
                                {editing ? (
                                    <>
                                        <input
                                            type="date"
                                            value={formData.birth_date ?? ''}
                                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                            className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
                                            placeholder="Date de naissance"
                                        />
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.poids ?? ''}
                                            onChange={(e) => setFormData({ ...formData, poids: Number(e.target.value) })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Poids (kg)"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p>
                                            <span className="font-medium">Âge :</span> {ageDisplay}
                                        </p>
                                        <p>
                                            <span className="font-medium">Poids :</span> {animal.poids} kg
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="font-semibold mb-3">👥 Compatibilités</h3>
                                {editing ? (
                                    <>
                                        <label className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.ok_congenere || false}
                                                onChange={(e) => setFormData({ ...formData, ok_congenere: e.target.checked })}
                                                className="mr-2 w-5 h-5 text-blue-600"
                                            />
                                            <span className="font-medium">OK congénères</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.ok_enfants || false}
                                                onChange={(e) => setFormData({ ...formData, ok_enfants: e.target.checked })}
                                                className="mr-2 w-5 h-5 text-blue-600"
                                            />
                                            <span className="font-medium">OK enfants</span>
                                        </label>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-4">📞 Contacts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {editing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={formData.prenom_proprietaire ?? ''}
                                            onChange={(e) => setFormData({ ...formData, prenom_proprietaire: e.target.value })}
                                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Prénom propriétaire"
                                        />
                                        <input
                                            type="tel"
                                            value={formData.telephone_1 ?? ''}
                                            onChange={(e) => setFormData({ ...formData, telephone_1: e.target.value })}
                                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Téléphone 1"
                                        />
                                        <input
                                            type="email"
                                            value={formData.mail_1 ?? ''}
                                            onChange={(e) => setFormData({ ...formData, mail_1: e.target.value })}
                                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Email 1"
                                        />
                                        <input
                                            type="tel"
                                            value={formData.telephone_veterinaire ?? ''}
                                            onChange={(e) => setFormData({ ...formData, telephone_veterinaire: e.target.value })}
                                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Téléphone vétérinaire"
                                        />
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 mt-8">
                            <EnablePushButton />
                            <TestPushButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}