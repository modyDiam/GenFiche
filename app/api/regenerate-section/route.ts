import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { FichesService } from '@/lib/fiches-service';
import type { FicheFASTEFContenu, ProgrammeChapitre } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      ficheId,
      sectionType,
      sectionIndex = 0,
      consigne = '',
      contenuActuel,
      chapitre,
    } = body as {
      ficheId: string;
      sectionType: 'exercices' | 'devoir_maison' | 'section';
      sectionIndex?: number;
      consigne?: string;
      contenuActuel: FicheFASTEFContenu;
      chapitre: ProgrammeChapitre;
    };

    if (!contenuActuel || !chapitre) {
      return NextResponse.json(
        { error: 'Données de la fiche manquantes pour la régénération.' },
        { status: 400 }
      );
    }

    const updatedContenu: FicheFASTEFContenu = JSON.parse(JSON.stringify(contenuActuel));
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && !apiKey.includes('votre_cle') && apiKey.trim().length > 10) {
      const ai = new GoogleGenAI({ apiKey });

      let targetPrompt = '';
      if (sectionType === 'exercices') {
        targetPrompt = `Tu es un inspecteur pédagogique FASTEF au Sénégal.
Régénère UNIQUEMENT les exercices d'évaluation pour le chapitre "${chapitre.titre_chapitre}" (${chapitre.matiere}, classe de ${chapitre.classe}).
Consigne spécifique de l'enseignant : "${consigne || 'Exercices variés adaptés au collège sénégalais'}".
Objectifs officiels du cours : ${chapitre.objectifs.join(', ')}.

Réponds UNIQUEMENT avec un JSON valide respectant ce format :
{
  "exercices": [
    {
      "titre": "Exercice 1 : ...",
      "type": "vrai_faux" | "choix_multiple" | "application",
      "enonce": "...",
      "elements": ["a) ...", "b) ..."]
    }
  ]
}`;
      } else if (sectionType === 'devoir_maison') {
        targetPrompt = `Tu es un enseignant FASTEF au Sénégal.
Régénère UNIQUEMENT le devoir à la maison pour le chapitre "${chapitre.titre_chapitre}".
Consigne spécifique : "${consigne || 'Devoir personnel de recherche et d\'application'}".

Réponds UNIQUEMENT avec un JSON valide respectant ce format :
{
  "devoir_maison": {
    "titre": "...",
    "consignes": "..."
  }
}`;
      } else {
        const currentSection = contenuActuel.sections[sectionIndex] || { titre: 'Partie du cours' };
        targetPrompt = `Tu es un formateur FASTEF au Sénégal.
Régénère UNIQUEMENT la section de cours suivante : "${currentSection.titre}" pour le chapitre "${chapitre.titre_chapitre}".
Consigne spécifique : "${consigne || 'Explication claire avec activité et exemples sénégalais'}".

Réponds UNIQUEMENT avec un JSON valide respectant ce format :
{
  "section": {
    "titre": "${currentSection.titre}",
    "activite": "Activité préparatoire...",
    "definition": "Définition ou règle clé...",
    "remarque": "Remarque méthodologique ou de sécurité...",
    "texte": "Explication théorique...",
    "exemples": ["Exemple local 1...", "Exemple local 2..."]
  }
}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: targetPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      if (sectionType === 'exercices' && parsed.exercices) {
        updatedContenu.exercices = parsed.exercices;
      } else if (sectionType === 'devoir_maison' && parsed.devoir_maison) {
        updatedContenu.devoir_maison = parsed.devoir_maison;
      } else if (sectionType === 'section' && parsed.section) {
        updatedContenu.sections[sectionIndex] = parsed.section;
      }
    } else {
      // Fallback intelligent
      if (sectionType === 'exercices') {
        updatedContenu.exercices = [
          {
            titre: 'Exercice 1 (Régénéré) : Contrôle des connaissances',
            type: 'vrai_faux',
            enonce: `Répondre par Vrai ou Faux en justifiant pour le chapitre ${chapitre.titre_chapitre} (${consigne || 'Niveau renforcé'}) :`,
            elements: [
              '1. Cette grandeur dépend uniquement de la température extérieure.',
              '2. L\'unité du Système International (SI) est le kilogramme par mètre cube.',
              '3. Deux corps de même volume ont toujours la même masse.',
            ],
          },
          {
            titre: 'Exercice 2 (Régénéré) : Problème contextualisé (Sénégal)',
            type: 'application',
            enonce: `Un artisan au marché Sandaga à Dakar manipule un échantillon (${consigne || 'Application pratique'}). Calculer la valeur demandée à partir des mesures relevées.`,
            elements: [
              'a) Exprimer la relation littérale avec ses unités.',
              'b) Effectuer l\'application numérique détaillée.',
              'c) Conclure sur la nature du matériau testé.',
            ],
          },
        ];
      } else if (sectionType === 'devoir_maison') {
        updatedContenu.devoir_maison = {
          titre: `Devoir individuel à la maison (${consigne || 'Recherche appliquée'})`,
          consignes: `Rédiger sur une feuille double une synthèse structurée sur les applications de ${chapitre.titre_chapitre} dans l'artisanat ou l'industrie au Sénégal. Citer au moins deux exemples observés dans votre environnement quotidien.`,
        };
      } else if (sectionType === 'section' && updatedContenu.sections[sectionIndex]) {
        const sec = updatedContenu.sections[sectionIndex];
        sec.activite = `Activité révisée selon consigne (${consigne || 'Approche expérimentale guidée'}) : Réaliser l'expérience en petits groupes à l'aide du matériel disponible.`;
        sec.exemples = [
          `Application révisée au Sénégal : Cas pratique observé lors du transport de sel à Kaolack.`,
          `Deuxième exemple : Mesure de pureté dans une coopérative agricole à Thiès.`,
        ];
      }
    }

    // Sauvegarde de la fiche mise à jour et réinitialisation de la relecture
    if (ficheId) {
      await FichesService.saveFiche({
        id: ficheId,
        contenu_genere: updatedContenu,
        est_relue: false, // Doit être relue à nouveau !
        statut: 'genere',
      });
    }

    return NextResponse.json({
      success: true,
      sectionType,
      sectionIndex,
      contenu_mis_a_jour: updatedContenu,
      message: `La section "${sectionType}" a été régénérée avec succès.`,
    });
  } catch (error: any) {
    console.error('Erreur régénération partielle:', error);
    return NextResponse.json(
      { error: error.message || 'Impossible de régénérer cette section.' },
      { status: 500 }
    );
  }
}
