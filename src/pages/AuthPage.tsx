import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'

export const AuthPage = () => {
    const { user, signUp, signIn } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [prenom, setPrenom] = useState('')
    const [animalId, setAnimalId] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [info, setInfo] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            if (isSignUp) {
                await signUp(email, password, prenom, animalId.toUpperCase())
            } else {
                await signIn(email, password)
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleForgotPassword = async () => {
        setError(null);
        setInfo(null);

        if (!email) {
            setError("Entre ton email pour recevoir le lien de réinitialisation");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://doggytracker.onrender.com/reset-password',
        });

        if (error) {
            setError(error.message);
        } else {
            setInfo("Email de réinitialisation envoyé. Vérifie ta boîte mail.");
        }
    };


    useEffect(() => {
        const animalParam = searchParams.get('animal');
        const modeParam = searchParams.get('mode');
        if (animalParam && !animalId) {
            setAnimalId(animalParam.toUpperCase());
        }
        if (modeParam === 'signup' && !isSignUp) {
            setIsSignUp(true);
        }
    }, [searchParams]);
    useEffect(() => {
        if (user) {
            window.location.href = '/dashboard';
        }
    }, [user]);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-6 border rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-center mb-6">
                {isSignUp ? 'Inscription' : 'Connexion'}
            </h3>

            {isSignUp && (
                <>
                    <input
                        type="text"
                        placeholder="Prénom"
                        value={prenom}
                        onChange={e => setPrenom(e.target.value)}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="ID animal (ex: B7M2X)"
                        value={animalId}
                        onChange={e => setAnimalId(e.target.value.toUpperCase())}
                        maxLength={5}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase tracking-wider font-mono"
                        required
                    />
                </>
            )}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
            />

            <input
                type="password"
                placeholder="Mot de passe (6+ caractères)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                minLength={6}
                required
            />
            <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 underline hover:text-blue-800 text-left"
            >
            Mot de passe oublié ?
            </button>

            {info && <p className="text-green-600 text-sm p-2 bg-green-50 rounded">{info}</p>}
            {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</p>}

            <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                {isSignUp ? "Créer mon compte" : 'Se connecter'}
            </button>

            <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-500 underline hover:text-gray-700"
            >
                {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
            </button>
        </form>
    )
}
