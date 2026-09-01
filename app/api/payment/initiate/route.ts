import { NextResponse } from 'next/server';
import { PLANS_TARIFAIRES } from '@/lib/subscription-service';
import type { MoyenPaiement } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, moyenPaiement, telephone, userId = 'demo_user' } = body as {
      planId: 'mensuel' | 'trimestriel' | 'annuel';
      moyenPaiement: MoyenPaiement;
      telephone: string;
      userId?: string;
    };

    const plan = PLANS_TARIFAIRES.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Forfait d\'abonnement invalide.' }, { status: 400 });
    }

    if (!['wave', 'orange_money'].includes(moyenPaiement)) {
      return NextResponse.json(
        { error: 'Moyen de paiement invalide (seuls Wave et Orange Money sont acceptés).' },
        { status: 400 }
      );
    }

    const cleanPhone = (telephone || '').replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      return NextResponse.json(
        { error: 'Numéro de téléphone sénégalais invalide (ex: 77 123 45 67).' },
        { status: 400 }
      );
    }

    const transactionId = `PAY_${moyenPaiement.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return NextResponse.json({
      success: true,
      transactionId,
      planId: plan.id,
      planNom: plan.nom,
      montantFCFA: plan.prixFCFA,
      moyenPaiement,
      telephone: cleanPhone,
      userId,
      instruction:
        moyenPaiement === 'wave'
          ? `Ouvrez votre application Wave sur le ${cleanPhone} pour valider le paiement de ${plan.prixFCFA.toLocaleString('fr-FR')} FCFA.`
          : `Composez #144# ou confirmez la notification Orange Money sur le ${cleanPhone} pour régler ${plan.prixFCFA.toLocaleString('fr-FR')} FCFA.`,
      status: 'pending',
    });
  } catch (error: any) {
    console.error('Erreur initiation paiement:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'initiation du paiement.' },
      { status: 500 }
    );
  }
}
