import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

type Params = Promise<{ tenantId: string }>;
export async function GET(
  request: NextRequest,
  segmentData: { params: Params },
): Promise<NextResponse> {
  const params = await segmentData.params;
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = request.headers.get('x-tenant-type') as TenantType;

  if (!params.tenantId) {
    return NextResponse.json(
      { error: 'Tenant ID is required' },
      { status: 400 },
    );
  }

  try {
    initializeFirebaseAdmin();
    const db = getFirestore();
    const tenantDoc = await db.collection('tenants').doc(params.tenantId).get();

    if (!tenantDoc.exists) {
      logger.error('Tenant not found', {
        email,
        tenantId: params.tenantId,
        tenantType,
        method: 'GET',
        route: '/api/tenants/[tenantId]',
        statusCode: 404,
      });
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json(tenantDoc.data());
  } catch (error) {
    logger.error('Error fetching tenant', {
      email,
      tenantId: params.tenantId,
      tenantType,
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
  segmentData: { params: Params },
): Promise<NextResponse> {
  const params = await segmentData.params;
  const data = await request.json();
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = request.headers.get('x-tenant-type') as TenantType;

  if (!params.tenantId) {
    logger.error('Missing tenant ID', {
      email,
      tenantId: params.tenantId,
      tenantType,
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
    const tenantDoc = await db.collection('tenants').doc(params.tenantId).get();

    if (!tenantDoc.exists) {
      logger.error('Tenant not found', {
        email,
        tenantId: params.tenantId,
        tenantType,
        method: 'PUT',
        route: '/api/tenants/[tenantId]',
        statusCode: 404,
      });
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    await tenantDoc.ref.update(data);

    logger.info('Tenant updated successfully', {
      email,
      tenantId: params.tenantId,
      tenantType,
      method: 'PUT',
      route: '/api/tenants/[tenantId]',
      statusCode: 200,
    });

    return NextResponse.json({ message: 'Tenant updated successfully' });
  } catch (error) {
    logger.error('Error updating tenant', {
      email,
      tenantId: params.tenantId,
      tenantType,
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
