'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProgrammeService } from '@/lib/programme-service';
import type { ProgrammeChapitre, Matiere, Classe } from '@/types/database';
import {
  BookOpen,
  Atom,
  Calculator,
  GraduationCap,
  Clock,
  Users,
  Calendar,
  School,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

function NouvelleFicheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedChapitreId = searchParams.get('chapitreId');

  const [matiere, setMatiere] = useState<Matiere>('pc');
  const [classe, setClasse] = useState<Classe>('3e');
  const [chapitres, setChapitres] = useState<ProgrammeChapitre[]>([]);
  const [selectedChapitre, setSelectedChapitre] = useState<ProgrammeChapitre | null>(null);

  // Paramètres personnalisés enseignant
  const [dureeReelle, setDureeReelle] = useState('4h');
  const [effectif, setEffectif] = useState(45);
  const [dateSeance, setDateSeance] = useState(new Date().toISOString().split('T')[0]);
  const [etablissement, setEtablissement] = useState('CEM Lamine Guèye (Dakar)');
  const [professeurNom, setProfesseurNom] = useState('Professeur');

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ficheCreated, setFicheCreated] = useState<any | null>(null);
  const [subStatus, setSubStatus] = useState<any | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetch('/api/subscription?userId=demo_user')
      .then((r) => r.json())
      .then((d) => {
        if (d.status) setSubStatus(d.status);
      })
      .catch((err) => console.warn('Erreur vérif abonnement:', err));
  }, []);

  // 1. Charger les infos enseignant pour pré-remplir
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.nom_complet) {
            setProfesseurNom(user.user_metadata.nom_complet);
          }
          if (user.user_metadata?.etablissement) {
            setEtablissement(user.user_metadata.etablissement);
          }
          if (user.user_metadata?.matieres && user.user_metadata.matieres.length > 0) {
            setMatiere(user.user_metadata.matieres[0]);
          }
        }
      } catch (e) {
        console.error('Erreur chargement profil:', e);
      }
    };
    loadProfile();
  }, [supabase]);

  // 2. Charger les chapitres selon la matière et classe
  useEffect(() => {
    const loadChapitres = async () => {
      setLoading(true);
      const list = await ProgrammeService.getChapitres(matiere, classe);
      setChapitres(list);

      if (preselectedChapitreId) {
        const found = list.find((c) => c.id === preselectedChapitreId);
        if (found) {
          setSelectedChapitre(found);
          setDureeReelle(found.duree_recommandee);
        } else if (list.length > 0) {
          setSelectedChapitre(list[0]);
          setDureeReelle(list[0].duree_recommandee);
        }
      } else if (list.length > 0) {
        setSelectedChapitre(list[0]);
        setDureeReelle(list[0].duree_recommandee);
      } else {
        setSelectedChapitre(null);
      }
      setLoading(false);
    };

    loadChapitres();
  }, [matiere, classe, preselectedChapitreId]);

  const handleSelectChapitre = (chap: ProgrammeChapitre) => {
    setSelectedChapitre(chap);
    setDureeReelle(chap.duree_recommandee);
  };

  const handleEnregistrerFiche = async () => {
    if (!selectedChapitre) return;
    setIsSubmitting(true);

    const ficheData = {
      id: 'fiche_' + Date.now(),
      chapitre_id: selectedChapitre.id,
      titre: selectedChapitre.titre_chapitre,
      matiere: selectedChapitre.matiere,
      classe: selectedChapitre.classe,
      parametres: {
        duree_reelle: selectedChapitre.duree_recommandee,
        effectif: Number(effectif),
        date: dateSeance,
        etablissement: etablissement,
        professeur_nom: professeurNom,
      },
      statut: 'brouillon',
      est_relue: false,
      created_at: new Date().toISOString(),
    };

    // Tentative d'enregistrement dans Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('fiches').insert([
            {
              user_id: user.id,
              chapitre_id: selectedChapitre.id,
              parametres: ficheData.parametres,
              statut: 'brouillon',
              est_relue: false,
            }
          ]);
        }
      } catch (err) {
        console.warn('Enregistrement Supabase fiches:', err);
      }
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`fiche_params_${ficheData.id}`, JSON.stringify(ficheData.parametres));
    }

    setFicheCreated(ficheData);
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
      {/* Fil d'ariane & Bouton retour */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F2C59] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au Tableau de Bord</span>
        </Link>
        <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200">
          Phase 2 — Sélection & Paramétrage
        </span>
      </div>

      {/* Alerte d'état d'abonnement Phase 6 */}
      {subStatus && (
        <div className="mb-6">
          {!subStatus.estEligibleGeneration ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <strong className="block text-red-950 font-bold text-xs">
                  ⚠️ Quota gratuit de découverte épuisé
                </strong>
                <p className="text-xs text-red-800">
                  Votre quota de 2 fiches est atteint. Activez votre pass mensuel (2 500 FCFA) ou annuel via Wave ou Orange Money pour continuer à préparer vos cours.
                </p>
              </div>
              <Link
                href="/dashboard/abonnement"
                className="shrink-0 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>S'abonner via Wave / OM</span>
              </Link>
            </div>
          ) : !subStatus.hasActiveSubscription ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3">
              <span>
                💡 <strong>Mode Découverte actif :</strong> Il vous reste <strong>{subStatus.fichesGratuitesRestantes} fiche(s) gratuite(s)</strong> d'essai.
              </span>
              <Link
                href="/dashboard/abonnement"
                className="text-xs font-bold text-[#0F2C59] underline shrink-0"
              >
                Pass Illimité (2 500 FCFA)
              </Link>
            </div>
          ) : null}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Préparer une nouvelle fiche FASTEF
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Sélectionnez la matière, le niveau et le chapitre du programme officiel sénégalais
        </p>
      </div>

      {ficheCreated ? (
        /* Confirmation de création de la fiche */
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-emerald-700">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fiche de cours initialisée avec succès !</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Les paramètres de votre classe et les contenus officiels du chapitre ont été associés.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Discipline</span>
                <strong className="text-[#0F2C59]">
                  {ficheCreated.matiere === 'pc' ? 'Physique-Chimie' : 'Mathématiques'} ({ficheCreated.classe})
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Chapitre</span>
                <strong className="text-slate-900">{ficheCreated.titre}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Durée & Effectif</span>
                <strong className="text-slate-900">
                  {ficheCreated.parametres.duree_reelle} • {ficheCreated.parametres.effectif} élèves
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Établissement</span>
                <strong className="text-slate-900">{ficheCreated.parametres.etablissement}</strong>
              </div>
            </div>
          </div>

          {/* Encart Phase 3 & Bouton de génération */}
          <div className="p-6 bg-gradient-to-r from-blue-900 to-[#0F2C59] text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Phase 3 Active</span>
              </div>
              <h3 className="font-bold text-base">Générer le contenu officiel avec Gemini</h3>
              <p className="text-xs text-blue-200 max-w-xl">
                L'appel serveur sécurisé transmettra les objectifs et le schéma FASTEF strict pour produire le JSON officiel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFicheCreated(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2.5 rounded-lg border border-white/20 transition-colors"
              >
                Modifier les choix
              </button>

              <Link
                href={`/dashboard/fiches/${ficheCreated.id}?chapitreId=${ficheCreated.chapitre_id}`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Générer le contenu Gemini ➔</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Formulaire de sélection */
        <div className="space-y-8">
          {/* Étape 1 & 2 : Matière & Classe */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0F2C59] text-amber-400 flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Discipline et Classe</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Choix Matière */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Discipline d'enseignement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMatiere('pc')}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      matiere === 'pc'
                        ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-md ring-2 ring-[#0F2C59]/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Atom className={`w-5 h-5 ${matiere === 'pc' ? 'text-amber-400' : 'text-blue-600'}`} />
                    <span>Physique-Chimie</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMatiere('maths')}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      matiere === 'maths'
                        ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-md ring-2 ring-[#0F2C59]/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Calculator className={`w-5 h-5 ${matiere === 'maths' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span>Mathématiques</span>
                  </button>
                </div>
              </div>

              {/* Choix Classe */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Niveau du Collège
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setClasse('4e')}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      classe === '4e'
                        ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-md ring-2 ring-[#0F2C59]/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className={`w-5 h-5 ${classe === '4e' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>Classe de 4ème</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClasse('3e')}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      classe === '3e'
                        ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-md ring-2 ring-[#0F2C59]/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className={`w-5 h-5 ${classe === '3e' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>Classe de 3ème</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Étape 3 : Sélection du Chapitre Officiel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0F2C59] text-amber-400 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span>Chapitre du Programme Officiel</span>
              </h2>

              <Link
                href="/admin/programme"
                className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Gérer / Ajouter des chapitres</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                Chargement des chapitres officiels...
              </div>
            ) : chapitres.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                Aucun chapitre enregistré pour {matiere === 'pc' ? 'Physique-Chimie' : 'Mathématiques'} ({classe}).
                <div className="mt-3">
                  <Link
                    href="/admin/programme"
                    className="inline-block bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Ajouter un chapitre dans le programme
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chapitres.map((chap) => {
                  const isSelected = selectedChapitre?.id === chap.id;
                  return (
                    <div
                      key={chap.id}
                      onClick={() => handleSelectChapitre(chap)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0F2C59] bg-blue-50/50 shadow-sm ring-2 ring-[#0F2C59]/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Chapitre {chap.ordre || 1}
                            </span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {chap.duree_recommandee}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm">{chap.titre_chapitre}</h3>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#0F2C59] text-amber-400 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Étape 4 : Aperçu des Données Officielles Immuables */}
          {selectedChapitre && (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-blue-300 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0F2C59]" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Contenu Officiel Immuable : {selectedChapitre.titre_chapitre}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                  Source officielle FASTEF (Non altérée par le LLM)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Objectifs Spécifiques Officiels */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <strong className="text-slate-800 font-bold block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Objectifs Pédagogiques Officiels (OS)
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {selectedChapitre.objectifs.map((obj, i) => (
                      <li key={i} className="leading-relaxed">{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* Notions & Contenus Officiels */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <strong className="text-slate-800 font-bold block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Contenus & Notions Clés
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {selectedChapitre.contenus.map((c, i) => (
                      <li key={i} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Activité et Matériel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="fastef-encadre-activite">
                  <strong className="text-amber-900 block mb-1 font-bold">
                    Activité préparatoire suggérée (Contexte local) :
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedChapitre.activites_preparatoires_suggerees || 'Activité expérimentale ou de recherche.'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <strong className="text-slate-800 font-bold block">
                    Matériel didactique suggéré :
                  </strong>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChapitre.materiel_suggere.map((mat, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 5 : Paramètres Personnalisés de l'Enseignant */}
          {selectedChapitre && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0F2C59] text-amber-400 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span>Paramètres de la séance (Ajustements Enseignant)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Durée officielle (Immuable) *</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">Fixe Ministère</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={selectedChapitre.duree_recommandee}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-800 font-bold cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Effectif de la classe (élèves) *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={effectif}
                      onChange={(e) => setEffectif(Number(e.target.value))}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date prévue du cours *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={dateSeance}
                      onChange={(e) => setDateSeance(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Établissement / Collège *
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={etablissement}
                      onChange={(e) => setEtablissement(e.target.value)}
                      placeholder="Ex: CEM Lamine Guèye"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nom du Professeur *
                  </label>
                  <input
                    type="text"
                    value={professeurNom}
                    onChange={(e) => setProfesseurNom(e.target.value)}
                    placeholder="M. Diallo"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                  />
                </div>
              </div>

              {/* Bouton d'action */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  La fiche sera initialisée avec le statut <span className="font-semibold text-slate-700">brouillon</span>.
                </p>

                <button
                  type="button"
                  onClick={handleEnregistrerFiche}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#0F2C59]/30 border-t-[#0F2C59] rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Valider les paramètres de la fiche</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NouvelleFichePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Chargement de l'interface...</div>}>
      <NouvelleFicheContent />
    </Suspense>
  );
}
