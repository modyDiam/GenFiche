import { NextResponse } from 'next/server';
import { JobService } from '@/lib/job-service';
import { SubscriptionService } from '@/lib/subscription-service';
import type { ProgrammeChapitre, FicheParametres } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ficheId, chapitre, parametres, userId } = body as {
      ficheId: string;
      chapitre: ProgrammeChapitre;
      parametres: FicheParametres;
      userId?: string;
    };

    if (!ficheId || !chapitre || !chapitre.titre_chapitre) {
      return NextResponse.json(
        { error: 'Données requises manquantes pour créer le job de génération.' },
        { status: 400 }
      );
    }

    // 0. Contrôle d'accès strict abonné / quota d'essai (Phase 6)
    const access = await SubscriptionService.checkUserAccess(userId || 'demo_user');
    if (!access.estEligibleGeneration) {
      return NextResponse.json(
        {
          error: 'ABONNEMENT_REQUIS',
          message:
            access.motifBlocage ||
            'Votre quota d\'essai est épuisé. Veuillez souscrire à un abonnement Wave ou Orange Money pour continuer.',
          code: 403,
        },
        { status: 403 }
      );
    }

    if (!access.hasActiveSubscription) {
      await SubscriptionService.recordGenerationUsage(userId || 'demo_user');
    }

    // 1. Création immédiate du ticket en file d'attente
    const job = await JobService.createJob(ficheId, userId);

    // 2. Lancement du traitement asynchrone en arrière-plan sans bloquer la requête HTTP
    // On n'attend pas (no await) pour libérer immédiatement le client
    JobService.processJobAsync(job.id, chapitre, parametres).catch((err) => {
      console.error(`Erreur asynchrone non interceptée sur le job ${job.id}:`, err);
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      ficheId,
      statut: job.statut,
      tentatives: job.tentatives,
      message: 'Job de génération FASTEF mis en file d\'attente avec succès.',
    });
  } catch (error: any) {
    console.error('Erreur POST /api/jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Impossible de créer le job.' },
      { status: 500 }
    );
  }
}
