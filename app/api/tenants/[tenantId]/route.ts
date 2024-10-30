import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import * as logger from '@/lib/logger/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } },
): Promise<NextResponse> {
  const { tenantId } = params;

  if (!tenantId) {
    return NextResponse.json(
      { error: 'Tenant ID is required' },
      { status: 400 },
    );
  }

  try {
    initializeFirebaseAdmin();
    const db = getFirestore();
    const tenantDoc = await db.collection('tenants').doc(tenantId).get();

    if (!tenantDoc.exists) {
      logger.error('Tenant not found', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: 'unknown',
        method: 'GET',
        route: '/api/tenants/[tenantId]',
        statusCode: 404,
      });
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json(tenantDoc.data());
  } catch (error) {
    logger.error('Error fetching tenant', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: 'unknown',
      method: 'GET',
      route: '/api/tenants/[tenantId]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } },
): Promise<NextResponse> {
  const { tenantId } = params;
  const data = await request.json();

  if (!tenantId) {
    logger.error('Missing tenant ID', {
      email: request.user?.email || 'anonymous',
      tenantId: 'unknown',
      tenantType: 'unknown',
      method: 'PUT',
      route: '/api/tenants/[tenantId]',
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
    const tenantDoc = await db.collection('tenants').doc(tenantId).get();

    if (!tenantDoc.exists) {
      logger.error('Tenant not found', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: 'unknown',
        method: 'PUT',
        route: '/api/tenants/[tenantId]',
        statusCode: 404,
      });
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    await tenantDoc.ref.update(data);

    logger.info('Tenant updated successfully', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: tenantDoc.data()?.type || 'unknown',
      method: 'PUT',
      route: '/api/tenants/[tenantId]',
      statusCode: 200,
    });

    return NextResponse.json({ message: 'Tenant updated successfully' });
  } catch (error) {
    logger.error('Error updating tenant', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: 'unknown',
      method: 'PUT',
      route: '/api/tenants/[tenantId]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
