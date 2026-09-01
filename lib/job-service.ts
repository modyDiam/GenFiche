import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from '@google/genai';
import {
  buildFASTEFSystemPrompt,
  buildFASTEFUserPrompt,
  FASTEF_JSON_SCHEMA,
  validateFASTEFJson,
  generateSimulatedFASTEF,
} from '@/lib/gemini';
import type { Job, JobStatut, ProgrammeChapitre, FicheParametres, FicheFASTEFContenu } from '@/types/database';

export interface JobRecord {
  id: string;
  fiche_id: string;
  user_id?: string;
  statut: JobStatut;
  tentatives: number;
  max_tentatives: number;
  erreur_eventuelle?: string | null;
  contenu_genere?: FicheFASTEFContenu | null;
  created_at: string;
  updated_at: string;
}

// Mémoire locale pour les jobs en cours d'exécution (fallback & cache réactif)
const inMemoryJobs = new Map<string, JobRecord>();

export class JobService {
  /**
   * Crée un nouveau job de génération en file d'attente
   */
  static async createJob(ficheId: string, userId?: string): Promise<JobRecord> {
    const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const record: JobRecord = {
      id: jobId,
      fiche_id: ficheId,
      user_id: userId,
      statut: 'en_attente',
      tentatives: 0,
      max_tentatives: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryJobs.set(jobId, record);

    // Tentative de persistance dans Supabase table jobs
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        await supabase.from('jobs').insert([
          {
            id: jobId,
            fiche_id: ficheId,
            user_id: userId || '00000000-0000-0000-0000-000000000000',
            statut: 'en_attente',
            tentatives: 0,
            erreur_eventuelle: null,
          },
        ]);
      } catch (err) {
        console.warn('Persistance Supabase job impossible (fallback mémoire actif):', err);
      }
    }

    return record;
  }

  /**
   * Récupère l'état courant d'un job
   */
  static async getJob(jobId: string): Promise<JobRecord | null> {
    // 1. Vérifier le cache mémoire
    if (inMemoryJobs.has(jobId)) {
      return inMemoryJobs.get(jobId)!;
    }

    // 2. Vérifier Supabase si configuré
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('jobs')
          .select('*, fiches(contenu_genere)')
          .eq('id', jobId)
          .single();

        if (!error && data) {
          const record: JobRecord = {
            id: data.id,
            fiche_id: data.fiche_id,
            user_id: data.user_id,
            statut: data.statut as JobStatut,
            tentatives: data.tentatives,
            max_tentatives: 3,
            erreur_eventuelle: data.erreur_eventuelle,
            contenu_genere: data.fiches?.contenu_genere || null,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
          inMemoryJobs.set(jobId, record);
          return record;
        }
      } catch (err) {
        console.warn('Lecture Supabase job:', err);
      }
    }

    return null;
  }

  /**
   * Traitement asynchrone du job avec boucle de retry et backoff
   */
  static async processJobAsync(
    jobId: string,
    chapitre: ProgrammeChapitre,
    parametres: FicheParametres
  ): Promise<void> {
    const job = inMemoryJobs.get(jobId);
    if (!job) return;

    job.statut = 'en_cours';
    job.updated_at = new Date().toISOString();

    const maxAttempts = job.max_tentatives || 3;
    let attempt = 0;
    let success = false;
    let dernierErreur = '';
    let resultContenu: FicheFASTEFContenu | null = null;

    while (attempt < maxAttempts && !success) {
      attempt++;
      job.tentatives = attempt;
      job.updated_at = new Date().toISOString();

      try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey && !apiKey.includes('votre_cle') && apiKey.trim().length > 10) {
          const ai = new GoogleGenAI({ apiKey });
          const systemPrompt = buildFASTEFSystemPrompt(
            chapitre.matiere,
            chapitre.classe,
            chapitre.titre_chapitre
          );
          const userPrompt = buildFASTEFUserPrompt(chapitre, parametres);

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: FASTEF_JSON_SCHEMA,
              temperature: 0.3,
            },
          });

          const rawText = response.text || '';
          const parsed = JSON.parse(rawText);
          const validation = validateFASTEFJson(parsed);

          if (!validation.valid) {
            throw new Error(`Validation schéma échouée : ${validation.errors.join(', ')}`);
          }

          resultContenu = parsed as FicheFASTEFContenu;
          success = true;
        } else {
          // Simulation réaliste avec temporisation pour observer la file d'attente
          await new Promise((r) => setTimeout(r, 1200));
          resultContenu = generateSimulatedFASTEF(chapitre, parametres);
          success = true;
        }
      } catch (err: any) {
        dernierErreur = err.message || 'Erreur inconnue lors de la génération.';
        console.warn(`Tentative #${attempt}/${maxAttempts} échouée pour le job ${jobId}:`, dernierErreur);

        if (attempt < maxAttempts) {
          // Attente progressive (backoff) avant de réessayer : 1.5s, puis 3s
          const delay = attempt * 1500;
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    if (success && resultContenu) {
      job.statut = 'termine';
      job.contenu_genere = resultContenu;
      job.erreur_eventuelle = null;
      job.updated_at = new Date().toISOString();

      // Mettre à jour Supabase si possible
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        try {
          const supabase = await createClient();
          await supabase
            .from('jobs')
            .update({
              statut: 'termine',
              tentatives: attempt,
              erreur_eventuelle: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', jobId);

          await supabase
            .from('fiches')
            .update({
              contenu_genere: resultContenu,
              statut: 'genere',
              est_relue: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', job.fiche_id);
        } catch (dbErr) {
          console.warn('Mise à jour Supabase post-job:', dbErr);
        }
      }
    } else {
      job.statut = 'erreur';
      job.erreur_eventuelle = dernierErreur || 'Nombre maximum de tentatives atteint sans succès.';
      job.updated_at = new Date().toISOString();

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        try {
          const supabase = await createClient();
          await supabase
            .from('jobs')
            .update({
              statut: 'erreur',
              tentatives: attempt,
              erreur_eventuelle: job.erreur_eventuelle,
              updated_at: new Date().toISOString(),
            })
            .eq('id', jobId);
        } catch (dbErr) {
          console.warn('Mise à jour statut erreur Supabase:', dbErr);
        }
      }
    }
  }
}
