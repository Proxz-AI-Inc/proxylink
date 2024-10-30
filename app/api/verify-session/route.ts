import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  const { session } = await request.json();

  if (!session) {
    return NextResponse.json({ error: 'No session provided' }, { status: 400 });
  }

  try {
    initializeFirebaseAdmin();
    const auth = getAuth();
    const decodedClaims = await auth.verifySessionCookie(session, true);

    return NextResponse.json(
      {
        status: 'success',
        user: {
          email: decodedClaims.email,
          tenantId: decodedClaims.tenantId,
          tenantType: decodedClaims.tenantType,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Session verification failed:', error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
