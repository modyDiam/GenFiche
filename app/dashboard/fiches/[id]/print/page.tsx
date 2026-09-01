'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ProgrammeService } from '@/lib/programme-service';
import { generateSimulatedFASTEF } from '@/lib/gemini';
import type { FicheFASTEFContenu, ProgrammeChapitre, FicheParametres } from '@/types/database';
import { Printer, ArrowLeft, Download, AlertTriangle } from 'lucide-react';

function PrintContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ficheId = (params?.id as string) || 'temp';
  const chapitreId = searchParams.get('chapitreId');

  const [chapitre, setChapitre] = useState<ProgrammeChapitre | null>(null);
  const [parametres, setParametres] = useState<FicheParametres>({
    duree_reelle: '4h',
    effectif: 45,
    date: new Date().toISOString().split('T')[0],
    etablissement: 'CEM Sénégal',
    professeur_nom: 'Professeur',
  });
  const [contenu, setContenu] = useState<FicheFASTEFContenu | null>(null);

  useEffect(() => {
    const load = async () => {
      let chap: ProgrammeChapitre | null = null;
      if (chapitreId) {
        chap = await ProgrammeService.getChapitreById(chapitreId);
      }
      if (!chap) {
        const list = await ProgrammeService.getChapitres('pc', '3e');
        chap = list[0] || (await ProgrammeService.getChapitres())[0];
      }
      setChapitre(chap);

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
            setContenu(JSON.parse(savedContenu));
          } catch {}
        } else if (chap) {
          setContenu(generateSimulatedFASTEF(chap, parametres));
        }
      }
    };
    load();
  }, [ficheId, chapitreId]);

  const handlePrint = () => {
    window.print();
  };

  if (!chapitre || !contenu) {
    return <div className="p-8 text-center text-xs text-slate-500">Chargement de la fiche pour impression...</div>;
  }

  return (
    <div className="bg-white min-h-screen text-slate-900 print:p-0">
      {/* Barre d'action d'impression (masquée lors de l'impression PDF) */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0F2C59] text-white px-6 py-3 shadow-md flex items-center justify-between">
        <Link
          href={`/dashboard/fiches/${ficheId}?chapitreId=${chapitre.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la fiche</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-200 hidden sm:inline">
            Astuce : Dans la boîte d'impression, choisissez « Enregistrer au format PDF »
          </span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C59] font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / Enregistrer en PDF</span>
          </button>
        </div>
      </div>

      {/* Feuille A4 paginée FASTEF */}
      <div className="max-w-[820px] mx-auto p-8 sm:p-12 print:max-w-none print:p-6 space-y-6 text-xs leading-relaxed font-sans">
        {/* Bandeau Déontologique */}
        <div className="border border-amber-300 bg-amber-50 p-2 text-center text-[10px] text-amber-900 font-semibold rounded">
          ⚠️ GABARIT OFFICIEL FASTEF (SÉNÉGAL) — FICHE DE PRÉPARATION PÉDAGOGIQUE À RELIRE AVANT LA CLASSE
        </div>

        {/* Titre Principal */}
        <div className="bg-[#0F2C59] text-white p-4 rounded text-center space-y-1">
          <h1 className="text-base font-black tracking-wider uppercase">
            FICHE PÉDAGOGIQUE — DISCIPLINE : {chapitre.matiere === 'pc' ? 'PHYSIQUE-CHIMIE' : 'MATHÉMATIQUES'} ({chapitre.classe})
          </h1>
          <h2 className="text-sm font-bold text-amber-300 uppercase">
            CHAPITRE : {chapitre.titre_chapitre}
          </h2>
        </div>

        {/* Tableau d'identification */}
        <div className="border border-slate-300 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 p-2 font-bold w-1/4 border-r border-slate-300">Établissement :</td>
                <td className="p-2 w-3/4">{parametres.etablissement}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 p-2 font-bold border-r border-slate-300">Professeur :</td>
                <td className="p-2">{parametres.professeur_nom}</td>
              </tr>
              <tr>
                <td className="bg-slate-100 p-2 font-bold border-r border-slate-300">Paramètres :</td>
                <td className="p-2">
                  Date : <strong>{parametres.date}</strong> &nbsp;|&nbsp; Durée : <strong>{parametres.duree_reelle}</strong> &nbsp;|&nbsp; Effectif : <strong>{parametres.effectif} élèves</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 1 : Identification Pédagogique */}
        <div className="space-y-3">
          <div className="bg-[#0F2C59] text-white px-3 py-1.5 font-bold uppercase rounded text-[11px]">
            I. FICHE D'IDENTIFICATION PÉDAGOGIQUE
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong className="block font-bold text-[#0F2C59] mb-1">A. Prérequis :</strong>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {contenu.prerequis.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong className="block font-bold text-[#0F2C59] mb-1">B. Matériel didactique :</strong>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {contenu.materiel.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded">
            <strong className="block font-bold text-[#0F2C59] mb-1">C. Objectifs Spécifiques (OS) :</strong>
            <ul className="list-disc list-inside space-y-0.5 font-semibold text-slate-800">
              {contenu.objectifs_specifiques.map((os, i) => (
                <li key={i}>{os}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-baseline gap-2">
            <strong className="font-bold text-[#0F2C59]">D. Concepts clés :</strong>
            <span className="text-slate-700 italic">{contenu.concepts_cles.join(' • ')}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong className="block font-bold text-[#0F2C59] mb-1">E. Plan du cours :</strong>
            <div className="space-y-0.5 text-slate-800 font-medium">
              {contenu.plan.map((p, i) => (
                <div key={i} className="pl-2">{p}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2 : Déroulement du cours */}
        <div className="space-y-4 pt-2">
          <div className="bg-[#0F2C59] text-white px-3 py-1.5 font-bold uppercase rounded text-[11px]">
            II. DÉROULEMENT DU COURS
          </div>

          {contenu.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2 border border-slate-200 p-3.5 rounded">
              <h3 className="font-bold text-slate-900 text-xs text-[#0F2C59] uppercase">{sec.titre}</h3>

              {sec.activite && (
                <div className="bg-amber-50/60 border-l-4 border-amber-500 p-2.5 rounded-r">
                  <strong className="text-amber-900 block mb-0.5 font-bold">Activité préparatoire (Contexte local) :</strong>
                  <p className="text-slate-700">{sec.activite}</p>
                </div>
              )}

              {sec.definition && (
                <div className="bg-slate-100 border-l-4 border-[#0F2C59] p-2.5 rounded-r">
                  <strong className="text-[#0F2C59] block mb-0.5 font-bold">Définition / Règle :</strong>
                  <p className="text-slate-900 font-medium">{sec.definition}</p>
                </div>
              )}

              {sec.texte && <p className="text-slate-700">{sec.texte}</p>}

              {sec.remarque && (
                <div className="text-[11px] text-amber-900 italic bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>Remarque :</strong> {sec.remarque}
                </div>
              )}

              {sec.exemples && sec.exemples.length > 0 && (
                <div className="text-slate-700 bg-slate-50 p-2 rounded">
                  <strong className="block text-slate-900 font-bold mb-0.5">Exemples sénégalais :</strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    {sec.exemples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sec.tableau && sec.tableau.colonnes && (
                <table className="w-full border border-slate-300 text-left mt-2">
                  <thead>
                    <tr className="bg-[#0F2C59] text-white">
                      {sec.tableau.colonnes.map((col, i) => (
                        <th key={i} className="p-1.5 border border-slate-400 font-bold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.tableau.lignes.map((row, rI) => (
                      <tr key={rI} className={rI % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        {row.map((cell, cI) => (
                          <td key={cI} className="p-1.5 border border-slate-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>

        {/* Section 3 : Évaluation */}
        <div className="space-y-3 pt-2">
          <div className="bg-[#0F2C59] text-white px-3 py-1.5 font-bold uppercase rounded text-[11px]">
            III. ÉVALUATION FORMATIVE (EXERCICES)
          </div>

          <div className="grid grid-cols-2 gap-4">
            {contenu.exercices.map((exo, i) => (
              <div key={i} className="border border-slate-200 bg-slate-50 p-3 rounded space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{exo.titre}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{exo.type}</span>
                </div>
                <p className="text-slate-700">{exo.enonce}</p>
                {exo.elements && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 pt-0.5">
                    {exo.elements.map((el, elI) => (
                      <li key={elI}>{el}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 : Devoir Maison */}
        {contenu.devoir_maison && (
          <div className="space-y-2 pt-2">
            <div className="bg-[#0F2C59] text-white px-3 py-1.5 font-bold uppercase rounded text-[11px]">
              IV. DEVOIR À LA MAISON
            </div>
            <div className="border border-slate-200 p-3 rounded bg-slate-50">
              <strong className="block text-slate-900 font-bold mb-1">
                {contenu.devoir_maison.titre} :
              </strong>
              <p className="text-slate-700">{contenu.devoir_maison.consignes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Préparation de l'impression...</div>}>
      <PrintContent />
    </Suspense>
  );
}
