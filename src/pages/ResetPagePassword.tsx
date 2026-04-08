import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event !== 'PASSWORD_RECOVERY') {
          // on laisse quand même l'user définir un nouveau mdp si le lien est valide
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!password || password.length < 6) {
      setError('Mot de passe trop court (min 6 caractères)');
      return;
    }
    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setInfo('Mot de passe mis à jour');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto p-6 border rounded-lg shadow-md mt-10"
    >
      <h3 className="text-2xl font-bold text-center mb-4">Nouveau mot de passe</h3>

      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={password2}
        onChange={e => setPassword2(e.target.value)}
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />

      {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</p>}
      {info && <p className="text-green-600 text-sm p-2 bg-green-50 rounded">{info}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Mettre à jour le mot de passe
      </button>
    </form>
  );
};
