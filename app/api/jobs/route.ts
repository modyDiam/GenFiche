import { NextResponse } from 'next/server';
import { JobService } from '@/lib/job-service';
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
