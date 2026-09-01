import { NextResponse } from 'next/server';
import { SubscriptionService, PLANS_TARIFAIRES } from '@/lib/subscription-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo_user';

    const status = await SubscriptionService.checkUserAccess(userId);

    return NextResponse.json({
      status,
      plans: PLANS_TARIFAIRES,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Impossible de récupérer l\'abonnement.' },
      { status: 500 }
    );
  }
}
