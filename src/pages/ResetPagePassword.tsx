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
      () => {}
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
    <div className="flex-1 flex flex-col justify-center items-center px-5 py-12 bg-bg">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-text-primary text-center mb-8" style={{ fontFamily: "'Unbounded', sans-serif" }}>
          Nouveau mot de passe
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
              required
            />
          </div>

          {error && <p className="text-error text-xs p-3 bg-error/10 rounded">{error}</p>}
          {info && <p className="text-success text-xs p-3 bg-success/10 rounded">{info}</p>}

          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-bg font-semibold text-sm px-4 py-2.5 rounded transition-colors"
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};
