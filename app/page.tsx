import Link from 'next/link';
import { BookOpen, CheckCircle, Award, FileText, ArrowRight, ShieldCheck, Zap, Users, School } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0F2C59] to-[#1E3A8A] text-white py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Pattern de fond léger */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-500/30 mb-6 backdrop-blur-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Conforme aux normes de la FASTEF — Sénégal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Générez vos fiches pédagogiques FASTEF en quelques clics
          </h1>

          <p className="text-base sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
            Dédié aux enseignants de <strong>Mathématiques</strong> et <strong>Physique-Chimie</strong> du collège sénégalais (classes de <strong>4ème et 3ème</strong>). Gagnez du temps tout en respectant scrupuleusement le programme officiel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg border border-white/20 transition-colors"
            >
              <span>Espace Enseignant</span>
            </Link>
          </div>

          {/* Badges de réassurance */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-blue-800/80 pt-8 text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Gabarit FASTEF officiel</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Export Word (.docx) & PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Exemples sénégalais</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Programme 100% garanti</span>
            </div>
          </div>
        </div>
      </section>

      {/* Règle d'or & Spécificités FASTEF */}
      <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Conçu pour la rigueur pédagogique des collèges sénégalais
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Une méthodologie éprouvée qui combine la base officielle du ministère et l'assistance à la rédaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0F2C59] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[#0F2C59]" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Programme officiel immuable</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Les objectifs, contenus et durées proviennent strictement du référentiel validé. Aucune invention ou hallucination de programme scolaire.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Format FASTEF standardisé</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Bandeau d'en-tête bleu marine, identification (prérequis, matériel, OS), déroulement séquencé, encadrés grisés et évaluations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <School className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Ancrage local Sénégal</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Activités et situations adaptées au contexte local (marché de Kaolack, charbon de bois, huile d'arachide, pêche artisanale, calculs réels).
            </p>
          </div>
        </div>

        {/* Aperçu Visuel du Gabarit */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 shadow-md p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
            <div>
              <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">Structure type</span>
              <h4 className="text-lg font-bold text-slate-900">Gabarit d'une fiche FASTEF générée</h4>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-medium border border-slate-200">
              Classes 4e & 3e • Maths / PC
            </span>
          </div>

          {/* Fausse fiche FASTEF miniature */}
          <div className="border border-slate-300 rounded-lg p-4 sm:p-6 bg-slate-50 text-xs space-y-4">
            {/* Bandeau Titre */}
            <div className="bg-[#0F2C59] text-white p-3 rounded font-bold flex flex-wrap justify-between items-center text-xs">
              <span>FICHE PÉDAGOGIQUE — DISCIPLINE : PHYSIQUE-CHIMIE (3ème)</span>
              <span className="text-amber-300">DURÉE : 4 HEURES</span>
            </div>

            {/* Identification */}
            <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
              <div><strong>Établissement :</strong> CEM Sénégal</div>
              <div><strong>Effectif :</strong> 48 élèves</div>
              <div><strong>Date :</strong> 2026-09-01</div>
              <div><strong>Professeur :</strong> M. / Mme ...</div>
            </div>

            {/* Encadré d'activité */}
            <div className="fastef-encadre-activite bg-amber-50/50">
              <strong className="text-amber-900 block mb-1">Activité préparatoire suggérée (Contexte local) :</strong>
              <p className="text-slate-600">
                Observation de la pesée de volumes d'huile d'arachide et d'eau douce au marché pour introduire la notion de masse volumique et de densité.
              </p>
            </div>

            {/* Déroulement */}
            <div className="fastef-encadre">
              <strong className="text-[#0F2C59] block mb-1">Définition & Notion clé :</strong>
              <p className="text-slate-700 font-mono text-[11px]">
                Masse volumique ρ = m / V — Unités SI : kg/m³ ou g/cm³
              </p>
            </div>

            {/* Avertissement FASTEF obligatoire */}
            <div className="fastef-warning-banner">
              <span>⚠️ À relire et adapter impérativement avant utilisation en classe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action bas */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 text-center mt-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            Prêt à simplifier la préparation de vos cours ?
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Créez votre compte enseignant pour accéder au catalogue des chapitres et tester vos premières fiches.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Créer mon compte enseignant
            </Link>
            <Link
              href="/login"
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg border border-slate-700 transition-colors"
            >
              Me connecter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
