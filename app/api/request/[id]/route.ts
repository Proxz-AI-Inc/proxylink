// file: app/api/request/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import {
  Request,
  RequestLog,
  RequestWithLog,
  TenantType,
} from '@/lib/db/schema';
import { parseErrorMessage } from '@/utils/general';
import { detectChanges, updateRequestLog } from '@/lib/firebase/logs';
import * as logger from '@/lib/logger/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const { id } = params;
  const url = new URL(req.url);
  const tenantType = url.searchParams.get('tenantType') as TenantType | null;
  const tenantId = url.searchParams.get('tenantId');
  const includeLog = url.searchParams.get('includeLog') === 'true';

  if (!tenantType || !tenantId) {
    logger.error('Missing tenant information', {
      email: req.user?.email || 'anonymous',
      tenantId: tenantId || 'unknown',
      tenantType: tenantType || 'unknown',
      method: 'GET',
      route: `/api/request/${id}`,
      statusCode: 400,
      requestId: id,
    });
    return new NextResponse(
      JSON.stringify({ error: 'Missing tenant information' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const db: Firestore = getFirestore();
  const requestRef = db.collection('requests').doc(id);

  try {
    const doc = await requestRef.get();

    if (!doc.exists) {
      logger.error('Request not found', {
        email: req.user?.email || 'anonymous',
        tenantId,
        tenantType,
        method: 'GET',
        route: `/api/request/${id}`,
        statusCode: 404,
        requestId: id,
      });
      return new NextResponse(JSON.stringify({ error: 'Request not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const request = doc.data() as Request;
    let response: Request | RequestWithLog = request;

    // Verify that the requester has permission to access this request
    if (
      (tenantType === 'proxy' && request.proxyTenantId !== tenantId) ||
      (tenantType === 'provider' && request.providerTenantId !== tenantId)
    ) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized access' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (includeLog) {
      const logRef = db.collection('requestsLog').doc(request.logId);
      const logDoc = await logRef.get();

      if (logDoc.exists) {
        response = {
          ...response,
          log: logDoc.data() as RequestLog,
        };
      }
    }

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching request', {
      email: req.user?.email || 'anonymous',
      tenantId,
      tenantType,
      method: 'GET',
      route: `/api/request/${id}`,
      statusCode: 500,
      requestId: id,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const db: Firestore = getFirestore();
  const { id } = params;

  try {
    const docRef = db.collection('requests').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return new NextResponse(JSON.stringify({ error: 'Request not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const currentRequest = doc.data() as Request;
    const updatedRequest: Partial<Request> = await req.json();
    await docRef.update(updatedRequest);

    const changes = detectChanges(currentRequest, updatedRequest);
    if (changes.length > 0) {
      await updateRequestLog(currentRequest.logId, changes, req);
    }

    logger.info('Request updated successfully', {
      email: req.user?.email || 'anonymous',
      tenantId:
        updatedRequest.proxyTenantId ||
        updatedRequest.providerTenantId ||
        'unknown',
      tenantType: updatedRequest.proxyTenantId ? 'proxy' : 'provider',
      method: 'PATCH',
      route: `/api/request/${id}`,
      statusCode: 200,
      requestId: id,
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error updating request', {
      email: req.user?.email || 'anonymous',
      tenantId: req.user?.tenantId || 'unknown',
      tenantType: req.user?.tenantType as TenantType,
      method: 'PATCH',
      route: `/api/request/${id}`,
      statusCode: 500,
      requestId: id,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    console.error('Error updating request:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Error updating document: ' + parseErrorMessage(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
