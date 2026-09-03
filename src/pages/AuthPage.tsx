import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'

export const AuthPage = () => {
    const { user, signUp, signIn } = useAuth()
    const [searchParams] = useSearchParams();
    const [isSignUp, setIsSignUp] = useState(() => searchParams.get('mode') === 'signup')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [prenom, setPrenom] = useState('')
    const [animalId, setAnimalId] = useState(() => searchParams.get('animal')?.toUpperCase() ?? '')
    const [error, setError] = useState<string | null>(null)
    const [info, setInfo] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            if (isSignUp) {
                await signUp(email, password, prenom, animalId.toUpperCase())
            } else {
                await signIn(email, password)
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
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
        if (user) {
            window.location.href = '/dashboard';
        }
    }, [user]);

    return (
        <div className="flex-1 flex flex-col justify-center items-center px-5 py-12">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="font-unbounded text-xl font-bold text-text-primary">
                        {isSignUp ? 'Inscription' : 'Connexion'}
                    </h1>
                    <p className="text-xs text-text-secondary mt-2">
                        {isSignUp ? 'Crée ton compte pour gérer la fiche de ton animal' : 'Connecte-toi à ton espace'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Prénom</label>
                                <input
                                    type="text"
                                    placeholder="Prénom"
                                    value={prenom}
                                    onChange={e => setPrenom(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">ID de l'animal</label>
                                <input
                                    type="text"
                                    placeholder="ex: B7M2X"
                                    value={animalId}
                                    onChange={e => setAnimalId(e.target.value.toUpperCase())}
                                    maxLength={5}
                                    className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted uppercase"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Adresse Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider">Mot de passe</label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-[11px] font-medium text-accent hover:text-accent-hover transition-colors"
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="6+ caractères"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                            minLength={6}
                            required
                        />
                    </div>

                    {info && <p className="text-success text-xs p-3 bg-success/10 rounded">{info}</p>}
                    {error && <p className="text-error text-xs p-3 bg-error/10 rounded">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-hover text-bg font-semibold text-sm px-4 py-2.5 rounded transition-colors"
                    >
                        {isSignUp ? "Créer mon compte" : 'Se connecter'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs text-text-muted hover:text-text-secondary block mx-auto transition-colors"
                    >
                        {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
                    </button>
                </form>
            </div>
        </div>
    )
}
