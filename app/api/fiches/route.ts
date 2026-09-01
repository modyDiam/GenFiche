import { NextResponse } from 'next/server';
import { FichesService } from '@/lib/fiches-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo_user';
    const id = searchParams.get('id');

    if (id) {
      const fiche = await FichesService.getFicheById(id);
      if (!fiche) {
        return NextResponse.json({ error: 'Fiche introuvable.' }, { status: 404 });
      }
      return NextResponse.json({ fiche });
    }

    const fiches = await FichesService.getAllFiches(userId);
    return NextResponse.json({ fiches });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors du chargement des fiches.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await FichesService.saveFiche(body);
    return NextResponse.json({ success: true, fiche: saved });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la sauvegarde.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, est_relue } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID de fiche manquant.' }, { status: 400 });
    }

    await FichesService.toggleRelecture(id, est_relue);
    return NextResponse.json({ success: true, id, est_relue });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID manquant.' }, { status: 400 });
    }

    await FichesService.deleteFiche(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la suppression.' },
      { status: 500 }
    );
  }
}
