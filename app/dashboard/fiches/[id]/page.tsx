'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ProgrammeService } from '@/lib/programme-service';
import type { FicheFASTEFContenu, ProgrammeChapitre, FicheParametres } from '@/types/database';
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Code2,
  Eye,
  Clock,
  School,
  Users,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldCheck,
  FileText,
  Printer,
} from 'lucide-react';

function FicheDetailContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const ficheId = (params?.id as string) || 'fiche_temp';
  const chapitreIdParam = searchParams.get('chapitreId');

  const [chapitre, setChapitre] = useState<ProgrammeChapitre | null>(null);
  const [parametres, setParametres] = useState<FicheParametres>({
    duree_reelle: '4h',
    effectif: 45,
    date: new Date().toISOString().split('T')[0],
    etablissement: 'CEM Lamine Guèye (Dakar)',
    professeur_nom: 'Professeur',
  });

  const [contenuGenere, setContenuGenere] = useState<FicheFASTEFContenu | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRelue, setIsRelue] = useState(false);
  const [activeTab, setActiveTab] = useState<'json' | 'preview'>('json');
  const [copied, setCopied] = useState(false);
  const [generationInfo, setGenerationInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger le chapitre et les paramètres enregistrés
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      let chap: ProgrammeChapitre | null = null;

      // 1. Recherche du chapitre par ID
      if (chapitreIdParam) {
        chap = await ProgrammeService.getChapitreById(chapitreIdParam);
      }
      if (!chap) {
        // Prendre le premier chapitre par défaut
        const list = await ProgrammeService.getChapitres('pc', '3e');
        chap = list[0] || (await ProgrammeService.getChapitres())[0];
      }

      setChapitre(chap);

      // Récupérer d'éventuels paramètres en session / storage
      if (typeof window !== 'undefined') {
        const savedParams = sessionStorage.getItem(`fiche_params_${ficheId}`);
        if (savedParams) {
          try {
            setParametres(JSON.parse(savedParams));
          } catch {}
        }
        const savedContenu = sessionStorage.getItem(`fiche_contenu_${ficheId}`);
        if (savedContenu) {
          try {
            setContenuGenere(JSON.parse(savedContenu));
          } catch {}
        }
      }

      setLoading(false);
    };

    initData();
  }, [ficheId, chapitreIdParam]);

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatut, setJobStatut] = useState<string | null>(null);
  const [jobTentatives, setJobTentatives] = useState(0);
  const [jobError, setJobError] = useState<string | null>(null);

  // Déclencheur de l'appel asynchrone en file d'attente (Phase 5)
  const handleGenerateGemini = async () => {
    if (!chapitre) return;
    setIsGenerating(true);
    setJobError(null);
    setGenerationInfo(null);
    setJobStatut('en_attente');
    setJobTentatives(1);

    try {
      // 1. Soumission du job à l'API asynchrone
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ficheId,
          chapitre,
          parametres,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise en file d\'attente.');
      }

      const jobId = data.jobId;
      setActiveJobId(jobId);

      // 2. Polling régulier de l'état d'avancement du job
      const interval = setInterval(async () => {
        try {
          const pollRes = await fetch(`/api/jobs/${jobId}`);
          if (!pollRes.ok) return;

          const jobData = await pollRes.json();
          setJobStatut(jobData.statut);
          setJobTentatives(jobData.tentatives || 1);

          if (jobData.statut === 'termine' && jobData.contenu_genere) {
            clearInterval(interval);
            setIsGenerating(false);
            setContenuGenere(jobData.contenu_genere);
            setIsRelue(false);
            setGenerationInfo('Génération FASTEF finalisée avec succès via la file d\'attente asynchrone.');

            if (typeof window !== 'undefined') {
              sessionStorage.setItem(`fiche_contenu_${ficheId}`, JSON.stringify(jobData.contenu_genere));
            }
          } else if (jobData.statut === 'erreur') {
            clearInterval(interval);
            setIsGenerating(false);
            setJobError(jobData.erreur_eventuelle || 'Erreur lors du traitement en arrière-plan.');
          }
        } catch (pollErr) {
          console.warn('Polling job error:', pollErr);
        }
      }, 1200);
    } catch (err: any) {
      console.error('Erreur soumission job:', err);
      setIsGenerating(false);
      setJobError(err.message || 'Impossible de contacter le service de file d\'attente.');
    }
  };

  const handleCopyJson = () => {
    if (!contenuGenere) return;
    navigator.clipboard.writeText(JSON.stringify(contenuGenere, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [targetSectionToRegenerate, setTargetSectionToRegenerate] = useState<{
    type: 'exercices' | 'devoir_maison' | 'section';
    index?: number;
    label: string;
  } | null>(null);
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(false);
  const [consigneCustom, setConsigneCustom] = useState('');

  const handleRegenerateSection = async () => {
    if (!targetSectionToRegenerate || !contenuGenere || !chapitre) return;
    setIsRegeneratingSection(true);

    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ficheId,
          sectionType: targetSectionToRegenerate.type,
          sectionIndex: targetSectionToRegenerate.index ?? 0,
          consigne: consigneCustom,
          contenuActuel: contenuGenere,
          chapitre,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la régénération.');
      }

      setContenuGenere(data.contenu_mis_a_jour);
      setIsRelue(false); // Obligation déontologique : relecture requise après régénération partielle
      setTargetSectionToRegenerate(null);
      setConsigneCustom('');
      setGenerationInfo(data.message);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`fiche_contenu_${ficheId}`, JSON.stringify(data.contenu_mis_a_jour));
      }
    } catch (err: any) {
      console.error('Erreur régénération partielle:', err);
      alert(err.message || 'Impossible de régénérer cette section.');
    } finally {
      setIsRegeneratingSection(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!chapitre || !contenuGenere) return;
    setIsExportingDocx(true);
    try {
      const response = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapitre,
          parametres,
          contenu: contenuGenere,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du document Word.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fiche_FASTEF_${chapitre.matiere}_${chapitre.classe}_${chapitre.titre_chapitre.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Erreur export Word:', err);
      alert('Erreur lors de la génération Word.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadJson = () => {
    if (!contenuGenere || !chapitre) return;
    const blob = new Blob([JSON.stringify(contenuGenere, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiche_FASTEF_${chapitre.matiere}_${chapitre.classe}_${chapitre.titre_chapitre.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-5xl mx-auto p-12 text-center text-xs text-slate-500">
        Chargement de la fiche...
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Fil d'ariane & Bouton retour */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F2C59] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au Tableau de Bord</span>
        </Link>
        <span className="text-xs bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Phase 3 — Sortie JSON Gemini (FASTEF)</span>
        </span>
      </div>

      {/* En-tête de la Fiche */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  chapitre?.matiere === 'pc' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {chapitre?.matiere === 'pc' ? 'Physique-Chimie' : 'Mathématiques'} • {chapitre?.classe}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Durée : {parametres.duree_reelle}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Users className="w-3 h-3" />
                {parametres.effectif} élèves
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {chapitre?.titre_chapitre || 'Fiche pédagogique FASTEF'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{parametres.etablissement}</span>
              <span>•</span>
              <span>Professeur : {parametres.professeur_nom}</span>
              <span>•</span>
              <span>{parametres.date}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateGemini}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Génération Gemini en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{contenuGenere ? 'Régénérer via Gemini' : 'Lancer la génération Gemini'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Point de vigilance FASTEF OBLIGATOIRE (Section 5 du prompt) */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold block mb-0.5 text-amber-950">
              ⚠️ Règle déontologique FASTEF — À relire avant utilisation en classe
            </strong>
            {isRelue ? (
              <span className="text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                Fiche marquée comme relue et validée par l'enseignant.
              </span>
            ) : (
              <span>
                Cette fiche a été produite automatiquement par l'IA. Elle doit obligatoirement être relue et ajustée par le professeur avant utilisation devant les élèves.
              </span>
            )}
          </div>
        </div>

        {!isRelue && (
          <button
            onClick={() => setIsRelue(true)}
            className="shrink-0 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            Marquer comme relue
          </button>
        )}
      </div>

      {/* File d'attente asynchrone Phase 5 en direct */}
      {isGenerating && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></div>
              <h3 className="font-bold text-slate-900 text-sm">
                File d'attente asynchrone FASTEF (Phase 5)
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-blue-50 text-[#0F2C59] font-bold px-2.5 py-1 rounded-full border border-blue-200">
              Ticket : {activeJobId || 'initialisation...'}
            </span>
          </div>

          {/* Étapes du job */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                jobStatut === 'en_attente'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>1. En file d'attente</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                jobStatut === 'en_cours'
                  ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 shrink-0 ${jobStatut === 'en_cours' ? 'animate-spin' : ''}`} />
              <span>
                2. Appel Gemini (Essai {jobTentatives}/3)
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                jobStatut === 'termine'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3. Validation FASTEF</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Ce traitement asynchrone absorbe les limites de quota de Gemini et évite les blocages de session.
          </p>
        </div>
      )}

      {/* Erreur de job avec bouton Retry */}
      {jobError && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <strong className="block text-red-950 font-bold text-xs">
              Échec du traitement du job (quotas dépassés ou erreur réseau)
            </strong>
            <p className="text-xs text-red-800">{jobError}</p>
          </div>
          <button
            onClick={handleGenerateGemini}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* Notification d'état de génération */}
      {generationInfo && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-center justify-between gap-2">
          <span>{generationInfo}</span>
          <button
            onClick={() => setGenerationInfo(null)}
            className="text-xs font-bold underline opacity-70"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Si aucune génération n'a encore été lancée */}
      {!contenuGenere && !isGenerating && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Prêt à générer le contenu officiel FASTEF
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Gemini recevra les objectifs officiels du chapitre <strong className="text-slate-900">{chapitre?.titre_chapitre}</strong> et produira un JSON strict validé (déroulement, définitions, activités locales, exercices).
          </p>
          <button
            onClick={handleGenerateGemini}
            className="px-6 py-3 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Générer maintenant (JSON strict FASTEF)</span>
          </button>
        </div>
      )}

      {/* Affichage des résultats générés */}
      {contenuGenere && (
        <div className="space-y-6">
          {/* Barre d'exportation Phase 4 (Word & PDF) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2C59] flex items-center justify-center font-black shrink-0">
                <FileText className="w-5 h-5 text-[#0F2C59]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Exporter la fiche au gabarit officiel FASTEF</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Phase 4 Active
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Document complet avec mise en page FASTEF (titres bleu marine, encadrés, tableaux)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleDownloadDocx}
                disabled={isExportingDocx}
                className="inline-flex items-center gap-2 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isExportingDocx ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <FileText className="w-4 h-4 text-amber-400" />
                )}
                <span>Télécharger en Word (.docx)</span>
              </button>

              <Link
                href={`/dashboard/fiches/${ficheId}/print?chapitreId=${chapitre?.id}`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer / Exporter en PDF</span>
              </Link>
            </div>
          </div>

          {/* Barre d'onglets (JSON Brut / Vue Structurée) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('json')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'json'
                    ? 'bg-[#0F2C59] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>JSON Brut FASTEF (Validation Phase 3)</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-[#0F2C59] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Vue Structurée FASTEF</span>
              </button>
            </div>

            {/* Actions JSON */}
            <div className="flex items-center gap-2 px-2">
              <button
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                title="Copier le JSON dans le presse-papier"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier JSON'}</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                title="Télécharger le fichier .json"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger JSON</span>
              </button>
            </div>
          </div>

          {/* Onglet 1 : Affichage du JSON Brut à l'écran (Exigence stricte Phase 3) */}
          {activeTab === 'json' && (
            <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Schéma FASTEF validé • Gemini responseSchema</span>
                </span>
                <span>{contenuGenere.sections?.length || 0} sections • {contenuGenere.exercices?.length || 0} exercices</span>
              </div>

              <pre className="overflow-x-auto max-h-[600px] leading-relaxed select-all">
                {JSON.stringify(contenuGenere, null, 2)}
              </pre>
            </div>
          )}

          {/* Onglet 2 : Vue structurée du Gabarit FASTEF */}
          {activeTab === 'preview' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* En-tête Gabarit FASTEF */}
              <div className="bg-[#0F2C59] text-white p-4 rounded-lg flex flex-wrap items-center justify-between gap-2 font-bold text-xs">
                <span>FICHE PÉDAGOGIQUE — {chapitre?.matiere === 'pc' ? 'PHYSIQUE-CHIMIE' : 'MATHÉMATIQUES'} ({chapitre?.classe})</span>
                <span className="text-amber-300">DURÉE : {parametres.duree_reelle}</span>
              </div>

              {/* Identification */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                <div><strong>Établissement :</strong> {parametres.etablissement}</div>
                <div><strong>Effectif :</strong> {parametres.effectif} élèves</div>
                <div><strong>Date :</strong> {parametres.date}</div>
                <div><strong>Professeur :</strong> {parametres.professeur_nom}</div>
              </div>

              {/* Prérequis & Matériel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block mb-2 font-bold">1. Prérequis nécessaires :</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {contenuGenere.prerequis.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block mb-2 font-bold">2. Matériel & Supports didactiques :</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {contenuGenere.materiel.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Objectifs Spécifiques & Plan de cours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                  <strong className="text-[#0F2C59] block mb-2 font-bold">3. Objectifs Spécifiques (OS) :</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                    {contenuGenere.objectifs_specifiques.map((os, i) => (
                      <li key={i}>{os}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block mb-2 font-bold">4. Plan de la séance (Conforme au programme) :</strong>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 font-medium">
                    {contenuGenere.plan.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Déroulement des sections de cours */}
              <div className="space-y-5">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  5. Déroulement séquencé du cours (Illustrations & Synthèse)
                </h3>

                {contenuGenere.sections.map((sec, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-[#0F2C59] text-sm">{sec.titre}</h4>
                      <button
                        onClick={() =>
                          setTargetSectionToRegenerate({
                            type: 'section',
                            index: idx,
                            label: sec.titre,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition-colors border border-slate-200 shrink-0"
                        title="Régénérer uniquement cette section"
                      >
                        <RefreshCw className="w-3 h-3 text-[#0F2C59]" />
                        <span>Régénérer cette section</span>
                      </button>
                    </div>

                    {sec.activite && (
                      <div className="fastef-encadre-activite text-xs">
                        <strong className="text-amber-900 block mb-1">Activité d'apprentissage :</strong>
                        <p className="text-slate-700 leading-relaxed">{sec.activite}</p>
                      </div>
                    )}

                    {sec.definition && (
                      <div className="fastef-encadre text-xs">
                        <strong className="text-[#0F2C59] block mb-1">Définition / Retenons :</strong>
                        <p className="text-slate-800 leading-relaxed font-medium">{sec.definition}</p>
                      </div>
                    )}

                    {sec.texte && (
                      <p className="text-xs text-slate-700 leading-relaxed">{sec.texte}</p>
                    )}

                    {sec.application && (
                      <div className="bg-emerald-50/70 border-l-4 border-emerald-600 p-3 rounded-r text-xs">
                        <strong className="text-emerald-950 block mb-1 font-bold">Application immédiate (Exemple résolu) :</strong>
                        <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-line">{sec.application}</p>
                      </div>
                    )}

                    {sec.remarque && (
                      <div className="bg-amber-50/70 p-3 rounded border border-amber-200 text-xs text-amber-900">
                        <strong>Remarque :</strong> {sec.remarque}
                      </div>
                    )}

                    {sec.schema_montage && sec.schema_montage.svg_code && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3 text-center">
                        <span className="text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider block mb-2">
                          📐 {sec.schema_montage.titre || 'Schéma du montage / Illustration scientifique'}
                        </span>
                        <div 
                          className="flex justify-center items-center max-w-full overflow-hidden [&>svg]:max-h-56 [&>svg]:w-auto bg-white p-3 rounded-lg border border-slate-100 shadow-inner"
                          dangerouslySetInnerHTML={{ __html: sec.schema_montage.svg_code }}
                        />
                        {sec.schema_montage.legendes && sec.schema_montage.legendes.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
                            {sec.schema_montage.legendes.map((leg, lIdx) => (
                              <span key={lIdx} className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2C59]" />
                                <span>{leg}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {sec.exemples && sec.exemples.length > 0 && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                        <strong className="text-slate-800 block mb-1">Exemples d'application (Contexte Sénégal) :</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {sec.exemples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {sec.tableau && sec.tableau.colonnes && (
                      <div className="overflow-x-auto text-xs mt-2">
                        <table className="min-w-full border border-slate-200">
                          <thead>
                            <tr className="bg-[#0F2C59] text-white text-left">
                              {sec.tableau.colonnes.map((col, i) => (
                                <th key={i} className="p-2 border border-blue-900">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.tableau.lignes.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2 border border-slate-200 text-slate-700">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Évaluation */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    5. Évaluation formative (Exercices)
                  </h3>
                  <button
                    onClick={() =>
                      setTargetSectionToRegenerate({
                        type: 'exercices',
                        label: 'Exercices d\'évaluation',
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-lg transition-colors border border-amber-300 shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                    <span>Régénérer les exercices (ex: niveau plus difficile)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {contenuGenere.exercices.map((exo, i) => (
                    <div key={i} className="border border-slate-200 bg-slate-50 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 font-bold">{exo.titre}</strong>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono uppercase">
                          {exo.type}
                        </span>
                      </div>
                      <p className="text-slate-700">{exo.enonce}</p>
                      {exo.elements && exo.elements.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-slate-600 pt-1">
                          {exo.elements.map((el, elIdx) => (
                            <li key={elIdx}>{el}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Devoir à la maison */}
              {contenuGenere.devoir_maison && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <strong className="text-[#0F2C59] block font-bold">
                      6. {contenuGenere.devoir_maison.titre || 'Devoir à la maison'} :
                    </strong>
                    <button
                      onClick={() =>
                        setTargetSectionToRegenerate({
                          type: 'devoir_maison',
                          label: 'Devoir à la maison',
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-2.5 py-0.5 rounded transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Régénérer le devoir</span>
                    </button>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {contenuGenere.devoir_maison.consignes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Modal de régénération partielle par section (Phase 7) */}
          {targetSectionToRegenerate && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <RefreshCw className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Régénérer : {targetSectionToRegenerate.label}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Le reste de la fiche reste rigoureusement intact.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTargetSectionToRegenerate(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Suggestions rapides */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Suggestions rapides d'ajustement :
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Niveau plus difficile (approfondissement)',
                      'Niveau plus accessible (remédiation)',
                      'Ajouter des exemples sénégalais (Kaolack, Dakar)',
                      'Activité expérimentale avec matériel simple',
                      'Exercice vrai/faux supplémentaire',
                    ].map((sugg, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setConsigneCustom(sugg)}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                      >
                        + {sugg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consigne personnalisée */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Votre consigne pédagogique spécifique :
                  </label>
                  <textarea
                    value={consigneCustom}
                    onChange={(e) => setConsigneCustom(e.target.value)}
                    placeholder="Ex: Proposer un problème d'application lié à la masse volumique de l'huile d'arachide au Sénégal..."
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    onClick={() => setTargetSectionToRegenerate(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleRegenerateSection}
                    disabled={isRegeneratingSection}
                    className="px-5 py-2 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {isRegeneratingSection ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Régénérer cette partie</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Encart Phase 4 */}
          <div className="p-4 bg-gradient-to-r from-blue-900 to-[#0F2C59] text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded">
                <Layers className="w-3.5 h-3.5" />
                <span>Phase 3 Validée • Prochaine étape : Phase 4</span>
              </div>
              <h4 className="font-bold text-sm">Rendu Document Word (.docx) & PDF FASTEF</h4>
              <p className="text-xs text-blue-200">
                La Phase 4 transformera ce JSON validé en document Word (.docx) et PDF téléchargeable conforme au style officiel FASTEF.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FicheDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Chargement de la fiche...</div>}>
      <FicheDetailContent />
    </Suspense>
  );
}

