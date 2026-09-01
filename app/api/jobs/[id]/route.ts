import { NextResponse } from 'next/server';
import { JobService } from '@/lib/job-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;

    if (!jobId) {
      return NextResponse.json({ error: 'Identifiant du job manquant.' }, { status: 400 });
    }

    const job = await JobService.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job introuvable.' }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      fiche_id: job.fiche_id,
      statut: job.statut,
      tentatives: job.tentatives,
      max_tentatives: job.max_tentatives,
      erreur_eventuelle: job.erreur_eventuelle,
      contenu_genere: job.contenu_genere,
      updated_at: job.updated_at,
    });
  } catch (error: any) {
    console.error('Erreur GET /api/jobs/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération du job.' },
      { status: 500 }
    );
  }
}
