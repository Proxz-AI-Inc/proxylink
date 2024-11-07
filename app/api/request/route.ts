// file: app/api/request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { parseErrorMessage } from '@/utils/general';
import {
  Request,
  RequestLog,
  RequestWithLog,
  TenantType,
} from '@/lib/db/schema';
import { createRequestLog } from '@/lib/firebase/logs';
import * as logger from '@/lib/logger/logger';
import { sendUploadNotification } from '@/lib/email/templates/NewRequestsCreatedTemplate';

/**
 * Handles GET requests to fetch requests based on tenant type and ID.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the fetched requests or an error message.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  initializeFirebaseAdmin();

  const url = new URL(req.url);
  const tenantType = url.searchParams.get('tenantType') as TenantType;
  const tenantId = url.searchParams.get('tenantId') ?? 'unknown';
  const includeLog = url.searchParams.get('includeLog') === 'true';
  const email = req.headers.get('x-user-email') ?? 'anonymous';

  if (!tenantType || !tenantId) {
    logger.error('Missing tenant information in GET /api/request', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/request',
      statusCode: 400,
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
  const requestsRef = db.collection('requests');
  let query;

  if (tenantType === 'proxy') {
    query = requestsRef.where('proxyTenantId', '==', tenantId);
  } else if (tenantType === 'provider') {
    query = requestsRef.where('providerTenantId', '==', tenantId);
  } else {
    return new NextResponse(JSON.stringify({ error: 'Invalid tenant type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const snapshot = await query.get();
    const requests = await Promise.all(
      snapshot.docs.map(async doc => {
        const request = doc.data() as Request;
        if (includeLog) {
          const logRef = db.collection('requestsLog').doc(request.logId);
          const logDoc = await logRef.get();
          if (logDoc.exists) {
            return {
              ...request,
              log: logDoc.data() as RequestLog,
            } as RequestWithLog;
          }
        }
        return request;
      }),
    );

    return new NextResponse(JSON.stringify(requests), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching requests', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/request',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching requests' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

/**
 * Handles POST requests to create multiple new requests.
 * @param {NextRequest} req - The incoming request object containing an array of requests.
 * @returns {Promise<NextResponse>} A response containing the created request IDs or an error message.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  initializeFirebaseAdmin();

  const body = await req.json();
  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = req.headers.get('x-tenant-id') ?? 'unknown';
  const tenantType = req.headers.get('x-tenant-type') as TenantType;
  try {
    // Log the incoming request
    logger.info(`Creating new, ${body.requests.length} requests`, {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/request',
    });

    const db: Firestore = getFirestore();
    const { requests }: { requests: Omit<Request, 'id'>[] } = body;

    if (!Array.isArray(requests)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid input: expected an array of requests',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const batch = db.batch();
    const createdIds: string[] = [];

    for (const requestData of requests) {
      const docRef = db.collection('requests').doc();
      const logRef = db.collection('requestsLog').doc();
      const fullRequest = {
        ...requestData,
        id: docRef.id,
        logId: logRef.id,
      };
      batch.set(docRef, fullRequest);
      createdIds.push(docRef.id);
      await createRequestLog(fullRequest);
    }

    await batch.commit();

    logger.info(`Successfully created ${body.requests.length} requests`, {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/request',
      statusCode: 201,
    });

    await sendUploadNotification({
      providerTenantId: requests[0].providerTenantId,
      proxyTenantId: requests[0].proxyTenantId,
      requestCount: requests.length,
      type: requests[0].requestType,
    });

    return new NextResponse(JSON.stringify({ ids: createdIds }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Failed to create requests', {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/request',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to create requests: ' + parseErrorMessage(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
