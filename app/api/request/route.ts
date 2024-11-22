// file: app/api/request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import {
  Request,
  RequestLog,
  RequestWithLog,
  TenantType,
} from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';
import { sendUploadNotification } from '@/lib/email/templates/NewRequestsCreatedTemplate';
import { createRequestLog } from '@/lib/firebase/logs';
import { parseErrorMessage } from '@/utils/general';

export async function GET(req: NextRequest): Promise<NextResponse> {
  initializeFirebaseAdmin();

  const url = new URL(req.url);

  const params = {
    tenantType: url.searchParams.get('tenantType') as TenantType,
    tenantId: url.searchParams.get('tenantId') ?? 'unknown',
    includeLog: url.searchParams.get('includeLog') === 'true',
    limit: parseInt(url.searchParams.get('limit') ?? '10'),
    cursor: url.searchParams.get('cursor'),
    dateFrom: url.searchParams.get('dateFrom'),
    dateTo: url.searchParams.get('dateTo'),
    status: url.searchParams.get('status'),
    requestType: url.searchParams.get('requestType'),
    searchId: url.searchParams.get('searchId'),
  };

  const email = req.headers.get('x-user-email') ?? 'anonymous';

  if (!params.tenantType || !params.tenantId) {
    return NextResponse.json(
      { error: 'Missing tenant information' },
      { status: 400 },
    );
  }

  const db: Firestore = getFirestore();
  const requestsRef = db.collection('requests');

  try {
    // Start with the required tenant filter
    let query =
      params.tenantType === 'proxy'
        ? requestsRef.where('proxyTenantId', '==', params.tenantId)
        : requestsRef.where('providerTenantId', '==', params.tenantId);

    // Add date range filter if provided
    if (params.dateFrom) {
      query = query.where('dateSubmitted', '>=', new Date(params.dateFrom));
    }
    if (params.dateTo) {
      query = query.where('dateSubmitted', '<=', new Date(params.dateTo));
    }

    // Add status filter if provided
    if (params.status) {
      query = query.where('status', '==', params.status);
    }

    // Add request type filter if provided
    if (params.requestType) {
      query = query.where('requestType', '==', params.requestType);
    }

    // Add ID search if provided
    if (params.searchId) {
      query = query
        .where('id', '>=', params.searchId)
        .where('id', '<=', params.searchId + '\uf8ff');
    }

    // Order by date for consistent pagination
    query = query.orderBy('dateSubmitted', 'desc');

    // Add cursor-based pagination
    if (params.cursor) {
      const cursorDoc = await requestsRef.doc(params.cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    // Get total count (for first page only)
    let totalCount = 0;
    if (!params.cursor) {
      const countQuery = query.count();
      const countSnapshot = await countQuery.get();
      totalCount = countSnapshot.data().count;
    }

    // Apply limit (get one extra to check for next page)
    query = query.limit(params.limit + 1);

    // Execute query
    const snapshot = await query.get();
    const requests: (Request | RequestWithLog)[] = [];
    let nextCursor: string | null = null;

    // Process results
    const docs = snapshot.docs;
    const hasMore = docs.length > params.limit;
    const resultsToProcess = hasMore ? docs.slice(0, -1) : docs;

    for (const doc of resultsToProcess) {
      const request = doc.data() as Request;

      if (params.includeLog) {
        const logRef = db.collection('requestsLog').doc(request.logId);
        const logDoc = await logRef.get();
        if (logDoc.exists) {
          requests.push({
            ...request,
            log: logDoc.data() as RequestLog,
          } as RequestWithLog);
        }
      } else {
        requests.push(request);
      }
    }

    // Set next cursor if there are more results
    if (hasMore) {
      nextCursor = docs[docs.length - 2].id;
    }

    return NextResponse.json(
      {
        items: requests,
        nextCursor,
        totalCount,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    logger.error('Error fetching requests', {
      email,
      tenantId: params.tenantId,
      tenantType: params.tenantType,
      method: 'GET',
      route: '/api/request',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      { error: 'Error fetching requests' },
      { status: 500 },
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

    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', email).get();
    const user = userQuery.docs[0]?.data();

    if (user?.notifications.actionNeededUpdates) {
      sendUploadNotification({
        providerTenantId: requests[0].providerTenantId,
        proxyTenantId: requests[0].proxyTenantId,
        requestCount: requests.length,
        type: requests[0].requestType,
      });
    }

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
