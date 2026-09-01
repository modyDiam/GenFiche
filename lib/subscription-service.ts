import { createClient } from '@/lib/supabase/server';
import type { MoyenPaiement } from '@/types/database';
import {
  type SubscriptionStatus,
  type PlanTarifaire,
  PLANS_TARIFAIRES,
} from '@/types/subscription';

export { type SubscriptionStatus, type PlanTarifaire, PLANS_TARIFAIRES };

// Cache mémoire local pour la persistance des abonnements en démo/fallback
interface LocalSubscription {
  userId: string;
  statut: 'actif' | 'inactif';
  dateExpiration: string;
  moyenPaiement: MoyenPaiement;
  fichesGenereesCount: number;
}

const localSubscriptions = new Map<string, LocalSubscription>();

export class SubscriptionService {
  private static DEFAULT_FREE_QUOTA = 2; // 2 fiches offertes pour tester

  /**
   * Vérifie le statut d'abonnement et le droit de générer d'un utilisateur
   */
  static async checkUserAccess(userId: string = 'demo_user'): Promise<SubscriptionStatus> {
    const now = new Date();

    // 1. Vérification dans Supabase si configuré
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('abonnements')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data && data.statut === 'actif') {
          const expDate = new Date(data.date_expiration);
          if (expDate > now) {
            const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return {
              hasActiveSubscription: true,
              moyenPaiement: data.moyen_paiement as MoyenPaiement,
              dateExpiration: data.date_expiration,
              joursRestants: diffDays,
              fichesGratuitesRestantes: 0,
              estEligibleGeneration: true,
            };
          }
        }
      } catch (err) {
        console.warn('Vérification abonnement Supabase:', err);
      }
    }

    // 2. Vérification dans le stockage local / mémoire
    const local = localSubscriptions.get(userId);
    if (local && local.statut === 'actif') {
      const expDate = new Date(local.dateExpiration);
      if (expDate > now) {
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          hasActiveSubscription: true,
          moyenPaiement: local.moyenPaiement,
          dateExpiration: local.dateExpiration,
          joursRestants: diffDays,
          fichesGratuitesRestantes: 0,
          estEligibleGeneration: true,
        };
      }
    }

    // 3. Quota gratuit (période d'essai)
    const countUsed = local ? local.fichesGenereesCount : 0;
    const fichesRestantes = Math.max(0, this.DEFAULT_FREE_QUOTA - countUsed);

    if (fichesRestantes > 0) {
      return {
        hasActiveSubscription: false,
        moyenPaiement: null,
        dateExpiration: null,
        joursRestants: 0,
        fichesGratuitesRestantes: fichesRestantes,
        estEligibleGeneration: true,
      };
    }

    return {
      hasActiveSubscription: false,
      moyenPaiement: null,
      dateExpiration: null,
      joursRestants: 0,
      fichesGratuitesRestantes: 0,
      estEligibleGeneration: false,
      motifBlocage:
        'Votre quota gratuit de 2 fiches est épuisé. Veuillez souscrire à un pass via Wave ou Orange Money pour continuer.',
    };
  }

  /**
   * Décrémente le quota gratuit lors d'une génération si l'utilisateur n'est pas abonné
   */
  static async recordGenerationUsage(userId: string = 'demo_user'): Promise<void> {
    const local = localSubscriptions.get(userId) || {
      userId,
      statut: 'inactif',
      dateExpiration: new Date().toISOString(),
      moyenPaiement: 'wave',
      fichesGenereesCount: 0,
    };

    local.fichesGenereesCount += 1;
    localSubscriptions.set(userId, local);
  }

  /**
   * Active un abonnement après réception d'un paiement Wave ou Orange Money
   */
  static async activateSubscription(
    userId: string = 'demo_user',
    planId: 'mensuel' | 'trimestriel' | 'annuel',
    moyenPaiement: MoyenPaiement
  ): Promise<SubscriptionStatus> {
    const plan = PLANS_TARIFAIRES.find((p) => p.id === planId) || PLANS_TARIFAIRES[0];
    const now = new Date();
    const expirationDate = new Date(now.getTime() + plan.dureeJours * 24 * 60 * 60 * 1000);

    // 1. Sauvegarde locale
    const record: LocalSubscription = {
      userId,
      statut: 'actif',
      dateExpiration: expirationDate.toISOString(),
      moyenPaiement,
      fichesGenereesCount: 0,
    };
    localSubscriptions.set(userId, record);

    // 2. Persistance dans Supabase si disponible
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        await supabase.from('abonnements').upsert({
          user_id: userId,
          statut: 'actif',
          moyen_paiement: moyenPaiement,
          date_expiration: expirationDate.toISOString(),
          updated_at: now.toISOString(),
        });
      } catch (err) {
        console.warn('Activation abonnement Supabase:', err);
      }
    }

    return {
      hasActiveSubscription: true,
      moyenPaiement,
      dateExpiration: expirationDate.toISOString(),
      joursRestants: plan.dureeJours,
      fichesGratuitesRestantes: 0,
      estEligibleGeneration: true,
    };
  }
}
