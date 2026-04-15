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
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 flex-1">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" /> */}
                <h2 className="text-center text-2xl/9 font-bold tracking-tight text-black">{isSignUp ? 'Inscription' : 'Connexion'}</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                        <>
                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-dark-grey">Prénom</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        value={prenom}
                                        onChange={e => setPrenom(e.target.value)}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark-grey outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-150 sm:text-sm/6"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-dark-grey">ID de l'animal</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="ID de l'animal (ex: B7M2X)"
                                        value={animalId}
                                        onChange={e => setAnimalId(e.target.value.toUpperCase())}
                                        maxLength={5}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark-grey outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-150 sm:text-sm/6"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}


                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium text-dark-grey">Adresse Email</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark-grey outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-150 sm:text-sm/6"
                                required
                            />
                        </div>
                    </div>



                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-dark-grey">Mot de passe</label>
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="font-semibold text-dark-grey hover:opacity-80 underline"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        </div>
                        <div className='mt-2'>

                            <input
                                type="password"
                                placeholder="Mot de passe (6+ caractères)"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark-grey outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-150 sm:text-sm/6"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    {info && <p className="text-green-600 text-sm p-2 bg-green-50 rounded">{info}</p>}
                    {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-yellow-150 px-3 py-1.5 text-sm/6 font-semibold text-dark-grey hover:bg-yellow-150/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-150"
                        >
                            {isSignUp ? "Créer mon compte" : 'Se connecter'}
                        </button>
                    </div>



                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-gray-500 underline hover:text-gray-700 block m-auto"
                    >
                        {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
                    </button>
                </form>
            </div>
        </div>
    )
}
