import { createClient } from '@/lib/supabase/server';
import type { Fiche, FicheParametres, FicheFASTEFContenu, ProgrammeChapitre } from '@/types/database';
import { ProgrammeService } from '@/lib/programme-service';
import { generateSimulatedFASTEF } from '@/lib/gemini';

// Mémoire locale pour persistance fluide en mode démo / fallback
let localFiches: Fiche[] = [];

// Fiches exemples initiales conformes au programme sénégalais FASTEF
const initialSeedDone = false;

async function ensureSeedFiches() {
  if (localFiches.length > 0) return;

  const chapitres = await ProgrammeService.getChapitres();
  const pcChap = chapitres.find((c) => c.matiere === 'pc' && c.classe === '3e') || chapitres[0];
  const mathsChap = chapitres.find((c) => c.matiere === 'maths' && c.classe === '3e') || chapitres[1];

  const paramsPC: FicheParametres = {
    duree_reelle: '4h',
    effectif: 46,
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    etablissement: 'CEM Lamine Guèye (Dakar)',
    professeur_nom: 'M. Diallo',
  };

  const paramsMaths: FicheParametres = {
    duree_reelle: '4h',
    effectif: 42,
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
    etablissement: 'CEM Malick Sy (Thiès)',
    professeur_nom: 'M. Diallo',
  };

  localFiches = [
    {
      id: 'fiche_demo_pc_1',
      user_id: 'demo_user',
      chapitre_id: pcChap.id,
      parametres: paramsPC,
      contenu_genere: generateSimulatedFASTEF(pcChap, paramsPC),
      statut: 'genere',
      est_relue: false,
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'fiche_demo_maths_2',
      user_id: 'demo_user',
      chapitre_id: mathsChap.id,
      parametres: paramsMaths,
      contenu_genere: generateSimulatedFASTEF(mathsChap, paramsMaths),
      statut: 'relu',
      est_relue: true,
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
  ];
}

export class FichesService {
  /**
   * Récupère l'historique complet des fiches
   */
  static async getAllFiches(userId: string = 'demo_user'): Promise<Fiche[]> {
    await ensureSeedFiches();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('fiches')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data as Fiche[];
        }
      } catch (err) {
        console.warn('Lecture Supabase fiches:', err);
      }
    }

    return [...localFiches].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  /**
   * Récupère une fiche par son identifiant
   */
  static async getFicheById(ficheId: string): Promise<Fiche | null> {
    await ensureSeedFiches();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('fiches')
          .select('*')
          .eq('id', ficheId)
          .single();

        if (!error && data) {
          return data as Fiche;
        }
      } catch (err) {
        console.warn('Lecture fiche par id Supabase:', err);
      }
    }

    const found = localFiches.find((f) => f.id === ficheId);
    return found || null;
  }

  /**
   * Sauvegarde ou met à jour une fiche
   */
  static async saveFiche(fiche: Partial<Fiche> & { id: string }): Promise<Fiche> {
    await ensureSeedFiches();

    const index = localFiches.findIndex((f) => f.id === fiche.id);
    let updated: Fiche;

    if (index >= 0) {
      updated = {
        ...localFiches[index],
        ...fiche,
        updated_at: new Date().toISOString(),
      };
      localFiches[index] = updated;
    } else {
      updated = {
        id: fiche.id,
        user_id: fiche.user_id || 'demo_user',
        chapitre_id: fiche.chapitre_id || 'chap_default',
        parametres: fiche.parametres || {
          duree_reelle: '4h',
          effectif: 40,
          date: new Date().toISOString().split('T')[0],
          etablissement: 'CEM Sénégal',
          professeur_nom: 'Professeur',
        },
        contenu_genere: fiche.contenu_genere || null,
        statut: fiche.statut || 'brouillon',
        est_relue: fiche.est_relue ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localFiches.unshift(updated);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        await supabase.from('fiches').upsert(updated);
      } catch (err) {
        console.warn('Persistance Supabase fiche:', err);
      }
    }

    return updated;
  }

  /**
   * Bascule le statut de relecture déontologique
   */
  static async toggleRelecture(ficheId: string, estRelue: boolean): Promise<boolean> {
    await ensureSeedFiches();

    const fiche = localFiches.find((f) => f.id === ficheId);
    if (fiche) {
      fiche.est_relue = estRelue;
      fiche.statut = estRelue ? 'relu' : 'genere';
      fiche.updated_at = new Date().toISOString();
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        await supabase
          .from('fiches')
          .update({
            est_relue: estRelue,
            statut: estRelue ? 'relu' : 'genere',
            updated_at: new Date().toISOString(),
          })
          .eq('id', ficheId);
      } catch (err) {
        console.warn('Mise à jour statut relecture Supabase:', err);
      }
    }

    return true;
  }

  /**
   * Supprime une fiche de l'historique
   */
  static async deleteFiche(ficheId: string): Promise<boolean> {
    await ensureSeedFiches();

    localFiches = localFiches.filter((f) => f.id !== ficheId);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        await supabase.from('fiches').delete().eq('id', ficheId);
      } catch (err) {
        console.warn('Suppression Supabase fiche:', err);
      }
    }

    return true;
  }
}
