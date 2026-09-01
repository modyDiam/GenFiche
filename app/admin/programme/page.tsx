'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgrammeService, DEFAULT_CHAPITRES } from '@/lib/programme-service';
import type { ProgrammeChapitre, Matiere, Classe } from '@/types/database';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Database,
  ArrowLeft,
  Clock,
  FileText,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function AdminProgrammePage() {
  const [chapitres, setChapitres] = useState<ProgrammeChapitre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filtres
  const [filtreMatiere, setFiltreMatiere] = useState<Matiere | 'tous'>('tous');
  const [filtreClasse, setFiltreClasse] = useState<Classe | 'tous'>('tous');

  // Champs du nouveau chapitre
  const [matiere, setMatiere] = useState<Matiere>('pc');
  const [classe, setClasse] = useState<Classe>('3e');
  const [titreChapitre, setTitreChapitre] = useState('');
  const [dureeRecommandee, setDureeRecommandee] = useState('4h');
  const [ordre, setOrdre] = useState(1);

  const [objectifs, setObjectifs] = useState<string[]>([
    "Définir les notions clés du chapitre",
    "Appliquer la règle ou formule dans des exercices types"
  ]);
  const [contenus, setContenus] = useState<string[]>([
    "Notion principale et vocabulaire scientifique",
    "Méthode de résolution et cas particuliers"
  ]);
  const [activiteSuggerre, setActiviteSuggeree] = useState('');
  const [materiel, setMateriel] = useState<string[]>([
    "Règle et instruments de géométrie",
    "Matériel de laboratoire ou objets du quotidien"
  ]);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadChapitres = async () => {
    setLoading(true);
    const list = await ProgrammeService.getChapitres();
    setChapitres(list);
    setLoading(false);
  };

  useEffect(() => {
    loadChapitres();
  }, []);

  // Gestion des listes dynamiques (objectifs, contenus, matériel)
  const handleAddObjectif = () => setObjectifs([...objectifs, '']);
  const handleRemoveObjectif = (index: number) => setObjectifs(objectifs.filter((_, i) => i !== index));
  const handleUpdateObjectif = (index: number, val: string) => {
    const updated = [...objectifs];
    updated[index] = val;
    setObjectifs(updated);
  };

  const handleAddContenu = () => setContenus([...contenus, '']);
  const handleRemoveContenu = (index: number) => setContenus(contenus.filter((_, i) => i !== index));
  const handleUpdateContenu = (index: number, val: string) => {
    const updated = [...contenus];
    updated[index] = val;
    setContenus(updated);
  };

  const handleAddMateriel = () => setMateriel([...materiel, '']);
  const handleRemoveMateriel = (index: number) => setMateriel(materiel.filter((_, i) => i !== index));
  const handleUpdateMateriel = (index: number, val: string) => {
    const updated = [...materiel];
    updated[index] = val;
    setMateriel(updated);
  };

  const handleSubmitNouveauChapitre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titreChapitre.trim()) {
      setNotification({ type: 'error', message: 'Veuillez renseigner le titre du chapitre.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const filteredObjectifs = objectifs.filter(o => o.trim().length > 0);
      const filteredContenus = contenus.filter(c => c.trim().length > 0);
      const filteredMateriel = materiel.filter(m => m.trim().length > 0);

      await ProgrammeService.addChapitre({
        matiere,
        classe,
        titre_chapitre: titreChapitre.trim(),
        duree_recommandee: dureeRecommandee.trim(),
        ordre: Number(ordre),
        objectifs: filteredObjectifs.length > 0 ? filteredObjectifs : ["Objectif officiel du chapitre"],
        contenus: filteredContenus.length > 0 ? filteredContenus : ["Contenu officiel du chapitre"],
        activites_preparatoires_suggerees: activiteSuggerre.trim(),
        materiel_suggere: filteredMateriel,
      });

      setNotification({
        type: 'success',
        message: `Le chapitre "${titreChapitre}" a été ajouté avec succès au programme officiel.`,
      });

      // Réinitialiser le formulaire
      setTitreChapitre('');
      setActiviteSuggeree('');
      setShowAddForm(false);
      await loadChapitres();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || "Erreur lors de l'enregistrement." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Voulez-vous réinitialiser le catalogue avec les chapitres officiels de référence sénégalais (FASTEF) ?")) {
      ProgrammeService.resetDefaultLocalChapitres();
      loadChapitres();
      setNotification({
        type: 'success',
        message: 'Le catalogue officiel a été réinitialisé avec les chapitres de référence sénégalais.',
      });
    }
  };

  const chapitresFiltres = chapitres.filter((c) => {
    if (filtreMatiere !== 'tous' && c.matiere !== filtreMatiere) return false;
    if (filtreClasse !== 'tous' && c.classe !== filtreClasse) return false;
    return true;
  });

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      {/* En-tête & Fil d'ariane */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F2C59] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au Tableau de Bord</span>
        </Link>
        <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-full border border-blue-200">
          Administration du Référentiel
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Database className="w-7 h-7 text-[#0F2C59]" />
            <span>Catalogue du Programme Officiel</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Table <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">programme_chapitres</code> • Base immuable du collège sénégalais (4e & 3e)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un chapitre officiel'}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 transition-colors"
            title="Restaurer les chapitres de base FASTEF"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <div className="flex-1">{notification.message}</div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline opacity-70 hover:opacity-100"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Rappel de la contrainte fondamentale */}
      <div className="mb-8 p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#0F2C59] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold block mb-0.5">
            Règle fondamentale FASTEF (Prompt Section 1) :
          </strong>
          Le contenu de chaque chapitre (objectifs spécifiques, notions, durées) est enregistré ici par l'enseignant ou l'inspecteur. Le LLM Gemini n'intervient que pour rédiger les activités et fiches correspondantes, et ne doit <strong>jamais inventer</strong> un objectif manquant.
        </div>
      </div>

      {/* Formulaire d'ajout de chapitre */}
      {showAddForm && (
        <div className="mb-10 bg-white rounded-2xl border-2 border-[#0F2C59] shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <span>Saisie d'un nouveau chapitre officiel</span>
            </h2>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
              FASTEF Sénégal
            </span>
          </div>

          <form onSubmit={handleSubmitNouveauChapitre} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Discipline *
                </label>
                <select
                  value={matiere}
                  onChange={(e) => setMatiere(e.target.value as Matiere)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                >
                  <option value="pc">Physique-Chimie</option>
                  <option value="maths">Mathématiques</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Niveau / Classe *
                </label>
                <select
                  value={classe}
                  onChange={(e) => setClasse(e.target.value as Classe)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                >
                  <option value="4e">Classe de 4ème</option>
                  <option value="3e">Classe de 3ème</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Durée officielle recommandée *
                </label>
                <input
                  type="text"
                  required
                  value={dureeRecommandee}
                  onChange={(e) => setDureeRecommandee(e.target.value)}
                  placeholder="Ex: 4h ou 6h"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro d'ordre dans l'année
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={ordre}
                  onChange={(e) => setOrdre(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Titre officiel du chapitre *
              </label>
              <input
                type="text"
                required
                value={titreChapitre}
                onChange={(e) => setTitreChapitre(e.target.value)}
                placeholder="Ex: Théorème de Pythagore ou Solutions aqueuses"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
              />
            </div>

            {/* Objectifs Spécifiques (Liste dynamique) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Objectifs Pédagogiques Officiels (OS) *
                </label>
                <button
                  type="button"
                  onClick={handleAddObjectif}
                  className="text-xs text-blue-700 hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un objectif</span>
                </button>
              </div>
              <div className="space-y-2">
                {objectifs.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 w-6">
                      OS{i + 1}
                    </span>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => handleUpdateObjectif(i, e.target.value)}
                      placeholder={`Ex: Définir la notion...`}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                    {objectifs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveObjectif(i)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contenus Officiels (Liste dynamique) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Notions & Contenus du Programme *
                </label>
                <button
                  type="button"
                  onClick={handleAddContenu}
                  className="text-xs text-blue-700 hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un contenu</span>
                </button>
              </div>
              <div className="space-y-2">
                {contenus.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 w-6">
                      •
                    </span>
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => handleUpdateContenu(i, e.target.value)}
                      placeholder={`Ex: Formule mathématique ou notion physique...`}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                    {contenus.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveContenu(i)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Activité suggérée (contexte Sénégal) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Activité préparatoire ou expérimentale suggérée (Ancrage Sénégal)
              </label>
              <textarea
                rows={2}
                value={activiteSuggerre}
                onChange={(e) => setActiviteSuggeree(e.target.value)}
                placeholder="Ex: Expérience avec le bissap local pour le pH, ou mesure d'ombre dans la cour pour Thalès..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
              />
            </div>

            {/* Matériel didactique */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Matériel et supports didactiques suggérés
                </label>
                <button
                  type="button"
                  onClick={handleAddMateriel}
                  className="text-xs text-blue-700 hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un matériel</span>
                </button>
              </div>
              <div className="space-y-2">
                {materiel.map((mat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={mat}
                      onChange={(e) => handleUpdateMateriel(i, e.target.value)}
                      placeholder="Ex: Éprouvettes, compas, balance..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                    {materiel.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMateriel(i)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span>Enregistrer dans le Programme</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barre de filtrage */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700">Filtrer par discipline :</span>
          <button
            onClick={() => setFiltreMatiere('tous')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              filtreMatiere === 'tous' ? 'bg-[#0F2C59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFiltreMatiere('pc')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              filtreMatiere === 'pc' ? 'bg-[#0F2C59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Physique-Chimie
          </button>
          <button
            onClick={() => setFiltreMatiere('maths')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              filtreMatiere === 'maths' ? 'bg-[#0F2C59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mathématiques
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">Classe :</span>
          <button
            onClick={() => setFiltreClasse('tous')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              filtreClasse === 'tous' ? 'bg-[#0F2C59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFiltreClasse('4e')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              filtreClasse === '4e' ? 'bg-[#0F2C59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            4ème
          </button>
          <button
            onClick={() => setFiltreClasse('3e')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              filtreClasse === '3e' ? 'bg-[#0F2C59] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3ème
          </button>
        </div>
      </div>

      {/* Liste des chapitres */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          Chargement du programme officiel...
        </div>
      ) : chapitresFiltres.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
          Aucun chapitre ne correspond aux critères de filtre.
        </div>
      ) : (
        <div className="space-y-4">
          {chapitresFiltres.map((chap) => (
            <div
              key={chap.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      chap.matiere === 'pc'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {chap.matiere === 'pc' ? 'Physique-Chimie' : 'Mathématiques'} • {chap.classe}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Chapitre {chap.ordre || 1} : {chap.titre_chapitre}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {chap.duree_recommandee}
                  </span>

                  <Link
                    href={`/dashboard/nouvelle-fiche?chapitreId=${chap.id}`}
                    className="inline-flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold px-3 py-1.5 rounded-md transition-colors"
                  >
                    <span>Préparer cette fiche</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Détails objectifs et contenus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <strong className="text-slate-800 block mb-1 text-[11px]">Objectifs officiels :</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {chap.objectifs.map((obj, i) => (
                      <li key={i} className="truncate">{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <strong className="text-slate-800 block mb-1 text-[11px]">Contenus du programme :</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {chap.contenus.map((c, i) => (
                      <li key={i} className="truncate">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {chap.activites_preparatoires_suggerees && (
                <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded border border-amber-200/50">
                  <strong className="text-amber-900 block text-[11px]">Activité locale suggérée :</strong>
                  <p className="text-[11px] text-slate-700 mt-0.5">
                    {chap.activites_preparatoires_suggerees}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
