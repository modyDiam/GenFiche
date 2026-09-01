'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProgrammeService } from '@/lib/programme-service';
import type { Fiche, ProgrammeChapitre } from '@/types/database';
import type { SubscriptionStatus } from '@/types/subscription';
import {
  BookOpen,
  User,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Printer,
  Search,
  Filter,
  Trash2,
  Plus,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    nom_complet: string;
    etablissement_defaut: string;
    matieres: string[];
  } | null>(null);

  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [chapitres, setChapitres] = useState<ProgrammeChapitre[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMatiere, setFilterMatiere] = useState<'all' | 'pc' | 'maths'>('all');
  const [filterClasse, setFilterClasse] = useState<'all' | '4e' | '3e'>('all');
  const [filterRelecture, setFilterRelecture] = useState<'all' | 'relue' | 'a_relire'>('all');

  const supabase = createClient();

  const loadData = async () => {
    try {
      // 1. Profil
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          nom_complet: user.user_metadata?.nom_complet || 'Professeur',
          etablissement_defaut: user.user_metadata?.etablissement || 'CEM Sénégal',
          matieres: user.user_metadata?.matieres || ['pc', 'maths'],
        });
      } else {
        setProfile({
          nom_complet: 'Professeur FASTEF',
          etablissement_defaut: 'CEM Lamine Guèye (Dakar)',
          matieres: ['pc', 'maths'],
        });
      }

      // 2. Chapitres
      const chaps = await ProgrammeService.getChapitres();
      setChapitres(chaps);

      // 3. Fiches
      const fichesRes = await fetch('/api/fiches?userId=demo_user');
      const fichesData = await fichesRes.json();
      if (fichesData.fiches) {
        setFiches(fichesData.fiches);
      }

      // 4. Abonnement
      const subRes = await fetch('/api/subscription?userId=demo_user');
      const subData = await subRes.json();
      if (subData.status) {
        setSubscription(subData.status);
      }
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Bascule du statut de relecture
  const handleToggleRelecture = async (ficheId: string, currentStatus: boolean) => {
    try {
      await fetch('/api/fiches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ficheId, est_relue: !currentStatus }),
      });
      setFiches((prev) =>
        prev.map((f) => (f.id === ficheId ? { ...f, est_relue: !currentStatus, statut: !currentStatus ? 'relu' : 'genere' } : f))
      );
    } catch (err) {
      console.error('Erreur relecture:', err);
    }
  };

  // Suppression d'une fiche
  const handleDeleteFiche = async (ficheId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette fiche de préparation ?')) return;
    try {
      await fetch(`/api/fiches?id=${ficheId}`, { method: 'DELETE' });
      setFiches((prev) => prev.filter((f) => f.id !== ficheId));
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  // Téléchargement Word direct depuis le tableau de bord
  const handleDownloadDocxDirect = async (fiche: Fiche) => {
    const chap = chapitres.find((c) => c.id === fiche.chapitre_id) || chapitres[0];
    if (!chap || !fiche.contenu_genere) return;

    try {
      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapitre: chap,
          parametres: fiche.parametres,
          contenu: fiche.contenu_genere,
        }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fiche_FASTEF_${chap.matiere}_${chap.classe}_${chap.titre_chapitre.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erreur lors du téléchargement Word.');
    }
  };

  // Filtrage des fiches
  const filteredFiches = fiches.filter((fiche) => {
    const chap = chapitres.find((c) => c.id === fiche.chapitre_id);
    const titre = (chap?.titre_chapitre || '').toLowerCase();
    const etablissement = (fiche.parametres?.etablissement || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = !search || titre.includes(search) || etablissement.includes(search);
    const matchesMatiere = filterMatiere === 'all' || chap?.matiere === filterMatiere;
    const matchesClasse = filterClasse === 'all' || chap?.classe === filterClasse;
    const matchesRelecture =
      filterRelecture === 'all' ||
      (filterRelecture === 'relue' && fiche.est_relue) ||
      (filterRelecture === 'a_relire' && !fiche.est_relue);

    return matchesSearch && matchesMatiere && matchesClasse && matchesRelecture;
  });

  const totalRelues = fiches.filter((f) => f.est_relue).length;
  const totalARelire = fiches.filter((f) => !f.est_relue).length;

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* En-tête Enseignant */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
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
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  subscription?.hasActiveSubscription
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {subscription?.hasActiveSubscription
                    ? `Abonné (${subscription.moyenPaiement?.toUpperCase()} • ${subscription.joursRestants}j)`
                    : `Mode Découverte (${subscription?.fichesGratuitesRestantes || 0} fiches)`}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {profile?.etablissement_defaut} • Sénégal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/abonnement"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-3 rounded-xl transition-colors border border-slate-200"
            >
              <CreditCard className="w-4 h-4 text-[#0F2C59]" />
              <span>Abonnement</span>
            </Link>

            <Link
              href="/dashboard/nouvelle-fiche"
              className="inline-flex items-center gap-2 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Nouvelle fiche</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cartes d'indicateurs pédagogiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0F2C59] flex items-center justify-center font-black">
            <FileText className="w-6 h-6 text-[#0F2C59]" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{fiches.length}</span>
            <p className="text-xs text-slate-500 font-medium">Fiches préparées</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-700">{totalRelues}</span>
            <p className="text-xs text-slate-500 font-medium">Validées pour la classe</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-700">{totalARelire}</span>
            <p className="text-xs text-slate-500 font-medium">À relire avant la classe</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-purple-900">FASTEF</span>
            <p className="text-xs text-slate-500 font-medium">Gabarit officiel sénégalais</p>
          </div>
        </div>
      </div>

      {/* Section Historique des fiches (Phase 7) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Historique de vos Fiches de Préparation</span>
              <span className="text-[11px] bg-blue-100 text-[#0F2C59] font-bold px-2.5 py-0.5 rounded-full">
                {filteredFiches.length} affichée(s)
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Retrouvez, modifiez, exportez en Word ou imprimez en PDF toutes vos fiches de cours.
            </p>
          </div>

          <Link
            href="/dashboard/nouvelle-fiche"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2C59] hover:underline"
          >
            <span>+ Générer un nouveau chapitre</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Recherche */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un chapitre..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
            />
          </div>

          {/* Filtre Matière */}
          <select
            value={filterMatiere}
            onChange={(e) => setFilterMatiere(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
          >
            <option value="all">Toutes disciplines (Maths & PC)</option>
            <option value="pc">Physique-Chimie</option>
            <option value="maths">Mathématiques</option>
          </select>

          {/* Filtre Classe */}
          <select
            value={filterClasse}
            onChange={(e) => setFilterClasse(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
          >
            <option value="all">Tous niveaux (4e & 3e)</option>
            <option value="4e">Classe de 4ème</option>
            <option value="3e">Classe de 3ème</option>
          </select>

          {/* Filtre Relecture */}
          <select
            value={filterRelecture}
            onChange={(e) => setFilterRelecture(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
          >
            <option value="all">Tous les statuts de validation</option>
            <option value="relue">Validées (Relues)</option>
            <option value="a_relire">À relire avant la classe</option>
          </select>
        </div>

        {/* Liste des cartes de fiches */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Chargement de votre historique...</div>
        ) : filteredFiches.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
            <p className="text-xs text-slate-500">Aucune fiche ne correspond à vos critères de recherche.</p>
            <Link
              href="/dashboard/nouvelle-fiche"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0F2C59] text-white px-4 py-2 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer une fiche maintenant</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFiches.map((fiche) => {
              const chap = chapitres.find((c) => c.id === fiche.chapitre_id) || {
                id: fiche.chapitre_id || '',
                titre_chapitre: 'Chapitre officiel',
                matiere: 'pc' as const,
                classe: '3e' as const,
              };

              return (
                <div
                  key={fiche.id}
                  className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          chap.matiere === 'pc' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {chap.matiere === 'pc' ? 'Physique-Chimie' : 'Mathématiques'} • {chap.classe}
                      </span>

                      <button
                        onClick={() => handleToggleRelecture(fiche.id, fiche.est_relue)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          fiche.est_relue
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                        }`}
                        title="Cliquer pour changer le statut"
                      >
                        {fiche.est_relue ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Relue & Validée</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>À relire avant la classe</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {chap.titre_chapitre}
                    </h3>

                    <p className="text-[11px] text-slate-500">
                      {fiche.parametres?.etablissement} • Séance de {fiche.parametres?.duree_reelle} • {fiche.parametres?.effectif} élèves
                    </p>
                  </div>

                  {/* Actions directes */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDownloadDocxDirect(fiche)}
                        className="inline-flex items-center gap-1 text-[11px] bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        title="Télécharger directement en Word (.docx)"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Word</span>
                      </button>

                      <Link
                        href={`/dashboard/fiches/${fiche.id}/print?chapitreId=${chap.id || ''}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        title="Imprimer ou enregistrer en PDF A4"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/fiches/${fiche.id}?chapitreId=${chap.id || ''}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0F2C59] hover:underline"
                      >
                        <span>Ouvrir</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDeleteFiche(fiche.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Supprimer la fiche"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
