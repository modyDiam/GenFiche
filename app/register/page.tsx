'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, UserPlus, AlertCircle, CheckCircle2, School, Sparkles, HelpCircle } from 'lucide-react';
import type { Matiere } from '@/types/database';

export default function RegisterPage() {
  const router = useRouter();

  const [nomComplet, setNomComplet] = useState('');
  const [etablissement, setEtablissement] = useState('');
  const [matiereOption, setMatiereOption] = useState<'maths' | 'pc' | 'les_deux'>('pc');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      setDemoNotice(true);
      setLoading(false);
      return;
    }

    const matieresArray: Matiere[] =
      matiereOption === 'les_deux' ? ['maths', 'pc'] : [matiereOption];

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom_complet: nomComplet,
            etablissement: etablissement,
            matieres: matieresArray,
            telephone: telephone,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        if (data.session) {
          // Connexion directe
          router.push('/dashboard');
          router.refresh();
        } else {
          // Confirmation email demandée par Supabase
          setSuccessMessage(
            'Votre compte a été créé avec succès ! Un e-mail de confirmation vous a été envoyé. Vous pouvez maintenant vous connecter.'
          );
          setLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        {/* En-tête formulaire */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-[#0F2C59] flex items-center justify-center mx-auto mb-3 shadow-md font-black">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inscription Enseignant
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Rejoignez la plateforme FASTEF pour préparer vos cours de 4e et 3e
          </p>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-lg flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              {successMessage}
              <div className="mt-2">
                <Link href="/login" className="font-bold underline text-emerald-900">
                  Aller à la page de connexion
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Notice Démo / Configuration Supabase */}
        {demoNotice && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <HelpCircle className="w-4 h-4" />
              <span>Base Supabase à relier via .env.local</span>
            </div>
            <p>
              Pour activer les inscriptions réelles, configurez vos clés Supabase dans <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> et exécutez <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">supabase/schema.sql</code>.
            </p>
            <button
              type="button"
              onClick={() => {
                router.push('/dashboard');
              }}
              className="mt-2 w-full py-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold rounded text-xs transition-colors"
            >
              Tester l'Espace Enseignant en mode démonstration
            </button>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="nomComplet">
                Nom complet & Prénom *
              </label>
              <input
                id="nomComplet"
                type="text"
                required
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                placeholder="M. Amadou Diallo"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="etablissement">
                Établissement / Collège *
              </label>
              <input
                id="etablissement"
                type="text"
                required
                value={etablissement}
                onChange={(e) => setEtablissement(e.target.value)}
                placeholder="CEM Lamine Guèye"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Matière(s) enseignée(s) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex items-center justify-center text-xs font-semibold p-2.5 rounded-lg border cursor-pointer transition-all ${
                  matiereOption === 'pc'
                    ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="matiere"
                  value="pc"
                  checked={matiereOption === 'pc'}
                  onChange={() => setMatiereOption('pc')}
                  className="sr-only"
                />
                Physique-Chimie
              </label>

              <label
                className={`flex items-center justify-center text-xs font-semibold p-2.5 rounded-lg border cursor-pointer transition-all ${
                  matiereOption === 'maths'
                    ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="matiere"
                  value="maths"
                  checked={matiereOption === 'maths'}
                  onChange={() => setMatiereOption('maths')}
                  className="sr-only"
                />
                Mathématiques
              </label>

              <label
                className={`flex items-center justify-center text-xs font-semibold p-2.5 rounded-lg border cursor-pointer transition-all ${
                  matiereOption === 'les_deux'
                    ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="matiere"
                  value="les_deux"
                  checked={matiereOption === 'les_deux'}
                  onChange={() => setMatiereOption('les_deux')}
                  className="sr-only"
                />
                Les deux
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="telephone">
                Téléphone (optionnel)
              </label>
              <input
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+221 77 123 45 67"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">
                Adresse e-mail *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prof@college.sn"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password">
              Mot de passe (minimum 6 caractères) *
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#0F2C59]/30 border-t-[#0F2C59] rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Créer mon compte enseignant</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Déjà inscrit sur la plateforme ?{' '}
            <Link href="/login" className="font-bold text-[#0F2C59] hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
