import { NextResponse } from 'next/server';
import { generateFASTEFDocx } from '@/lib/docx-generator';
import type { ProgrammeChapitre, FicheParametres, FicheFASTEFContenu } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chapitre, parametres, contenu } = body as {
      chapitre: ProgrammeChapitre;
      parametres: FicheParametres;
      contenu: FicheFASTEFContenu;
    };

    if (!chapitre || !contenu) {
      return NextResponse.json(
        { error: 'Données de la fiche manquantes pour la génération Word.' },
        { status: 400 }
      );
    }

    const docxBuffer = await generateFASTEFDocx(chapitre, parametres, contenu);

    const safeTitle = (chapitre.titre_chapitre || 'fiche_FASTEF')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    const filename = `Fiche_FASTEF_${chapitre.matiere}_${chapitre.classe}_${safeTitle}.docx`;

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': docxBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Erreur API export-docx:', error);
    return NextResponse.json(
      { error: error.message || 'Impossible de générer le fichier Word.' },
      { status: 500 }
    );
  }
}
