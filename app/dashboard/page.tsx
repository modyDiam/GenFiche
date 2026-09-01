'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProgrammeService } from '@/lib/programme-service';
import { 
  BookOpen, 
  User, 
  School, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Clock, 
  Award,
  Layers,
  ArrowRight,
  Database,
  Plus,
  Settings
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { ProgrammeChapitre } from '@/types/database';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{
    nom_complet: string;
    etablissement_defaut: string;
    matieres: string[];
  } | null>(null);
  const [chapitres, setChapitres] = useState<ProgrammeChapitre[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
          } else {
            setProfile({
              nom_complet: user.user_metadata?.nom_complet || 'Professeur',
              etablissement_defaut: user.user_metadata?.etablissement || "Collège d'enseignement moyen (CEM)",
              matieres: user.user_metadata?.matieres || ['pc', 'maths'],
            });
          }
        } else {
          setProfile({
            nom_complet: 'Enseignant FASTEF (Démonstration)',
            etablissement_defaut: 'CEM Sénégal (Dakar / Régions)',
            matieres: ['pc', 'maths'],
          });
        }

        // Récupérer la liste des chapitres officiels via le service
        const chapitresData = await ProgrammeService.getChapitres();
        setChapitres(chapitresData);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [supabase]);

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      {/* En-tête Enseignant */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0F2C59] text-amber-400 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {profile?.nom_complet || 'Espace Enseignant'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Compte Découverte (Actif)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <School className="w-4 h-4 text-slate-400" />
                  {profile?.etablissement_defaut || 'Collège non défini'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-medium text-[#0F2C59]">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  {profile?.matieres?.map(m => m === 'pc' ? 'Physique-Chimie' : 'Mathématiques').join(' & ') || 'PC / Maths'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/nouvelle-fiche"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Préparer une fiche</span>
            </Link>

            <Link
              href="/admin/programme"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Programme officiel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Point de vigilance FASTEF obligatoire */}
      <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong className="font-bold block mb-0.5">
              ⚠️ Règle déontologique FASTEF — Contrôle pédagogique obligatoire
            </strong>
            Toute fiche générée doit obligatoirement être relue, annotée et validée par l'enseignant avant toute utilisation en classe. Le professeur est seul garant de l'adéquation avec ses élèves et son matériel expérimental.
          </div>
        </div>
      </div>

      {/* État d'avancement du projet (Phase 2 active) */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0F2C59] text-white rounded-2xl p-6 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-400/30 mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phase 2 complétée : Sélection & Référentiel Officiel</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              Interface de sélection & Gestion du programme opérationnelles
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
              Vous pouvez filtrer par matière/classe, visualiser les contenus immuables officiels et ajuster les paramètres de cours. Prochaine étape : intégration Gemini (Phase 3).
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/15 text-xs">
            <div className="text-amber-300 font-semibold mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Prochaine étape : Phase 3
            </div>
            <p className="text-blue-100 max-w-xs">
              Intégration Gemini API (System prompt + responseSchema strict) pour générer le JSON de la fiche.
            </p>
          </div>
        </div>
      </div>

      {/* Catalogue officiel de chapitres */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 mb-6 gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0F2C59]" />
              <span>Programme officiel FASTEF (Table : programme_chapitres)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contenus et objectifs officiels validés — non générés ni inventés par l'IA
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/programme"
              className="text-xs text-blue-700 hover:underline font-semibold"
            >
              Voir tout le catalogue ({chapitres.length} chapitres)
            </Link>
          </div>
        </div>

        {/* Liste des chapitres */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Chargement des chapitres...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chapitres.map((chapitre) => (
              <div
                key={chapitre.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        chapitre.matiere === 'pc'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {chapitre.matiere === 'pc' ? 'Physique-Chimie' : 'Mathématiques'} • {chapitre.classe}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {chapitre.duree_recommandee}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-2">
                    {chapitre.titre_chapitre}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <p className="font-semibold text-slate-700 text-[11px]">Objectifs officiels :</p>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-600">
                      {chapitre.objectifs.slice(0, 2).map((obj, i) => (
                        <li key={i} className="truncate">{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span className="text-[11px]">Données validées</span>
                  <Link
                    href={`/dashboard/nouvelle-fiche?chapitreId=${chapitre.id}`}
                    className="text-[#0F2C59] hover:text-blue-900 font-bold text-[11px] flex items-center gap-0.5"
                  >
                    Préparer <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
