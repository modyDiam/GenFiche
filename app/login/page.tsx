'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, LogIn, AlertCircle, HelpCircle } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState(false);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      // Clés placeholder : simulation conviviale pour l'enseignant
      setDemoNotice(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Veuillez confirmer votre adresse e-mail avant de vous connecter.');
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
      {/* En-tête formulaire */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#0F2C59] text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Connexion Enseignant
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Accédez à vos fiches FASTEF de Mathématiques et PC
        </p>
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Notice Démo / Configuration Supabase */}
      {demoNotice && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-amber-800">
            <HelpCircle className="w-4 h-4" />
            <span>Clés Supabase à configurer dans .env.local</span>
          </div>
          <p>
            Pour connecter votre base de données réelle Supabase, collez votre URL et clé anon dans le fichier <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>.
          </p>
          <button
            type="button"
            onClick={() => {
              router.push('/dashboard');
            }}
            className="mt-2 w-full py-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold rounded text-xs transition-colors"
          >
            Accéder au Tableau de Bord en mode démonstration
          </button>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">
            Adresse e-mail académique ou personnelle
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="professeur@ecole.sn"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="password">
              Mot de passe
            </label>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Se connecter</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Vous n'avez pas encore de compte enseignant ?{' '}
          <Link href="/register" className="font-bold text-[#0F2C59] hover:underline">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Chargement...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
