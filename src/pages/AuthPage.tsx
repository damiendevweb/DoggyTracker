import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export const AuthPage = () => {
  const { signUp, signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [prenom, setPrenom] = useState('')
  const [animalId, setAnimalId] = useState('')  // ← champ ID
  const [error, setError] = useState<string | null>(null)

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'Inscription' : 'Connexion'}
      </h1>

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
