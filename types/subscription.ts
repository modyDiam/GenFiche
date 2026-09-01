import type { MoyenPaiement } from '@/types/database';

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  moyenPaiement?: MoyenPaiement | null;
  dateExpiration?: string | null;
  joursRestants: number;
  fichesGratuitesRestantes: number;
  estEligibleGeneration: boolean;
  motifBlocage?: string | null;
}

export interface PlanTarifaire {
  id: 'mensuel' | 'trimestriel' | 'annuel';
  nom: string;
  prixFCFA: number;
  dureeJours: number;
  description: string;
  populaire?: boolean;
}

export const PLANS_TARIFAIRES: PlanTarifaire[] = [
  {
    id: 'mensuel',
    nom: 'Pass Mensuel',
    prixFCFA: 2500,
    dureeJours: 30,
    description: 'Accès illimité pendant 30 jours, exports Word et PDF illimités.',
  },
  {
    id: 'trimestriel',
    nom: 'Pass Trimestriel',
    prixFCFA: 6000,
    dureeJours: 90,
    description: 'Idéal pour couvrir un trimestre scolaire entier (économisez 1 500 FCFA).',
    populaire: true,
  },
  {
    id: 'annuel',
    nom: 'Pass Année Scolaire',
    prixFCFA: 18000,
    dureeJours: 270,
    description: 'Couvre l\'intégralité des 9 mois de l\'année scolaire (octobre à juin).',
  },
];
