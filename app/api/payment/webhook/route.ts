import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscription-service';
import type { MoyenPaiement } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, userId = 'demo_user', planId, moyenPaiement, status = 'success' } = body as {
      transactionId: string;
      userId?: string;
      planId: 'mensuel' | 'trimestriel' | 'annuel';
      moyenPaiement: MoyenPaiement;
      status?: 'success' | 'failed';
    };

    if (!transactionId || !planId) {
      return NextResponse.json(
        { error: 'Données de confirmation de paiement incomplètes.' },
        { status: 400 }
      );
    }

    if (status !== 'success') {
      return NextResponse.json(
        { success: false, message: 'Paiement non validé par l\'opérateur.' },
        { status: 400 }
      );
    }

    // Activation immédiate de l'abonnement
    const updatedStatus = await SubscriptionService.activateSubscription(
      userId,
      planId,
      moyenPaiement || 'wave'
    );

    return NextResponse.json({
      success: true,
      transactionId,
      message: 'Abonnement activé avec succès !',
      abonnement: updatedStatus,
    });
  } catch (error: any) {
    console.error('Erreur webhook paiement:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la validation du paiement.' },
      { status: 500 }
    );
  }
}
