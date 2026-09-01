import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  buildFASTEFSystemPrompt,
  buildFASTEFUserPrompt,
  FASTEF_JSON_SCHEMA,
  validateFASTEFJson,
  generateSimulatedFASTEF,
} from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';
import type { ProgrammeChapitre, FicheParametres, FicheFASTEFContenu } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ficheId, chapitre, parametres } = body as {
      ficheId?: string;
      chapitre: ProgrammeChapitre;
      parametres: FicheParametres;
    };

    if (!chapitre || !chapitre.titre_chapitre || !chapitre.objectifs) {
      return NextResponse.json(
        { error: 'Données du chapitre officiel manquantes ou incomplètes.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let contenuGenere: FicheFASTEFContenu | null = null;
    let isDemo = false;

    // 1. Appel Gemini si la clé API est fournie et valide
    if (apiKey && !apiKey.includes('votre_cle') && apiKey.trim().length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = buildFASTEFSystemPrompt(
          chapitre.matiere,
          chapitre.classe,
          chapitre.titre_chapitre
        );
        const userPrompt = buildFASTEFUserPrompt(chapitre, parametres);

        // Appel strict côté serveur avec responseSchema
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: FASTEF_JSON_SCHEMA,
            temperature: 0.3, // Température basse pour maximiser la fidélité au programme
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText);

        const validation = validateFASTEFJson(parsed);
        if (!validation.valid) {
          console.warn('Incohérence schéma JSON Gemini:', validation.errors);
          // Fallback avec simulation enrichie
          contenuGenere = generateSimulatedFASTEF(chapitre, parametres);
          isDemo = true;
        } else {
          contenuGenere = parsed as FicheFASTEFContenu;
        }
      } catch (geminiError: any) {
        console.error('Erreur appel Gemini API:', geminiError);
        // Fallback pour résilience
        contenuGenere = generateSimulatedFASTEF(chapitre, parametres);
        isDemo = true;
      }
    } else {
      // Clé non renseignée : simulation complète FASTEF pour validation immédiate
      contenuGenere = generateSimulatedFASTEF(chapitre, parametres);
      isDemo = true;
    }

    // 2. Persistance dans Supabase si la table fiches est accessible
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder') && ficheId) {
      try {
        const supabase = await createClient();
        await supabase
          .from('fiches')
          .update({
            contenu_genere: contenuGenere,
            statut: 'genere',
            est_relue: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', ficheId);
      } catch (dbErr) {
        console.warn('Erreur mise à jour Supabase fiches:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      ficheId: ficheId || 'fiche_' + Date.now(),
      contenu_genere: contenuGenere,
      isDemo,
      message: isDemo
        ? 'Génération effectuée en mode démonstration FASTEF (renseignez GEMINI_API_KEY dans .env.local pour utiliser vos quotas Gemini).'
        : 'Génération réussie via Gemini API avec responseSchema strict FASTEF.',
    });
  } catch (error: any) {
    console.error('Erreur API generate-fiche:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur interne est survenue lors de la génération.' },
      { status: 500 }
    );
  }
}
