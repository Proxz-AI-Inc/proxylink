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
  let query = requestsRef.where('dummy', '==', 'dummy'); // Start with a base query

  try {
    // Build query with filters
    if (params.tenantType === 'proxy') {
      query = query.where('proxyTenantId', '==', params.tenantId);
    } else if (params.tenantType === 'provider') {
      query = query.where('providerTenantId', '==', params.tenantId);
    }

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
