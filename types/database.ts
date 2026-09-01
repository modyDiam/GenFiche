export type Matiere = 'maths' | 'pc';
export type Classe = '4e' | '3e';

export type FicheStatut = 'brouillon' | 'en_attente' | 'genere' | 'relu' | 'exporte';
export type JobStatut = 'en_attente' | 'en_cours' | 'termine' | 'erreur';
export type PlanType = 'decouverte' | 'mensuel' | 'annuel' | 'etablissement';
export type PaiementProvider = 'wave' | 'orange_money' | 'gratuit';
export type MoyenPaiement = 'wave' | 'orange_money';

export interface Profile {
  id: string;
  nom_complet: string;
  etablissement_defaut: string;
  matieres: Matiere[];
  telephone?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgrammeChapitre {
  id: string;
  matiere: Matiere;
  classe: Classe;
  titre_chapitre: string;
  duree_recommandee: string;
  objectifs: string[];
  contenus: string[];
  activites_preparatoires_suggerees: string;
  materiel_suggere: string[];
  ordre?: number;
  created_at: string;
}

export interface FicheParametres {
  duree_reelle: string;
  effectif: number;
  date: string;
  etablissement: string;
  professeur_nom?: string;
}

export interface FicheFASTEFContenu {
  prerequis: string[];
  materiel: string[];
  objectifs_specifiques: string[];
  concepts_cles: string[];
  plan: string[];
  sections: Array<{
    titre: string;
    activite?: string;
    definition?: string;
    tableau?: {
      colonnes: string[];
      lignes: string[][];
    };
    remarque?: string;
    texte?: string;
    exemples?: string[];
  }>;
  exercices: Array<{
    titre: string;
    type: 'vrai_faux' | 'choix_multiple' | 'application' | 'tableau';
    enonce: string;
    elements?: string[];
  }>;
  devoir_maison: {
    titre: string;
    consignes: string;
  };
}

export interface Fiche {
  id: string;
  user_id: string;
  chapitre_id: string;
  parametres: FicheParametres;
  contenu_genere: FicheFASTEFContenu | null;
  statut: FicheStatut;
  est_relue: boolean;
  docx_url?: string | null;
  pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  fiche_id: string;
  user_id: string;
  statut: JobStatut;
  erreur_eventuelle?: string | null;
  tentatives: number;
  created_at: string;
  updated_at: string;
}

export interface Abonnement {
  id: string;
  user_id: string;
  plan: PlanType;
  statut: 'actif' | 'expire' | 'en_attente_paiement';
  provider: PaiementProvider;
  reference_paiement?: string | null;
  date_expiration?: string | null;
  created_at: string;
  updated_at: string;
}
