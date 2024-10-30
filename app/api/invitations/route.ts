import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { collections, Invitation } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    logger.error('Missing tenant ID in GET /api/invitations', {
      email: request.user?.email || 'anonymous',
      tenantId: 'unknown',
      method: 'GET',
      route: '/api/invitations',
      statusCode: 400,
    });
    return NextResponse.json(
      { error: 'Tenant ID is required' },
      { status: 400 },
    );
  }

  try {
    initializeFirebaseAdmin();
    const db = getFirestore();

    const invitationsSnapshot = await db
      .collection(collections.invitations)
      .where('tenantId', '==', tenantId)
      .get();

    const invitations: Invitation[] = invitationsSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Invitation,
    );

    return NextResponse.json(invitations);
  } catch (error) {
    logger.error('Failed to fetch invitations', {
      email: request.user?.email || 'anonymous',
      tenantId,
      method: 'GET',
      route: '/api/invitations',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      { error: 'An error occurred while fetching invitations' },
      { status: 500 },
    );
  }
}
