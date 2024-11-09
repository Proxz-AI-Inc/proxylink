// file: app/api/request/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import {
  DecodedClaim,
  Request,
  RequestLog,
  RequestWithLog,
  TenantType,
} from '@/lib/db/schema';
import { parseErrorMessage } from '@/utils/general';
import { detectChanges, updateRequestLog } from '@/lib/firebase/logs';
import * as logger from '@/lib/logger/logger';
import { sendEmailUpdateNotification } from '@/lib/email/templates/RequestUpdatedTemplate';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { getAuth } from 'firebase-admin/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const { id } = params;
  const url = new URL(req.url);
  const tenantType = url.searchParams.get('tenantType') as TenantType;
  const tenantId = url.searchParams.get('tenantId');

  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const includeLog = url.searchParams.get('includeLog') === 'true';

  if (!tenantType || !tenantId) {
    logger.error('Missing tenant information', {
      email,
      tenantId: tenantId || 'unknown',
      tenantType: tenantType || 'unknown',
      method: 'GET',
      route: `/api/request/${id}`,
      statusCode: 400,
      requestId: id,
    });
    return NextResponse.json(
      { error: 'Missing tenant information' },
      {
        status: 400,
      },
    );
  }

  const db: Firestore = getFirestore();
  const requestRef = db.collection('requests').doc(id);

  try {
    const doc = await requestRef.get();

    if (!doc.exists) {
      logger.error('Request not found', {
        email,
        tenantId,
        tenantType,
        method: 'GET',
        route: `/api/request/${id}`,
        statusCode: 404,
        requestId: id,
      });
      return new NextResponse(JSON.stringify({ error: 'Request not found' }), {
        status: 404,
      });
    }

    const request = doc.data() as Request;
    let response: Request | RequestWithLog = request;

    // Verify that the requester has permission to access this request
    if (
      (tenantType === 'proxy' && request.proxyTenantId !== tenantId) ||
      (tenantType === 'provider' && request.providerTenantId !== tenantId)
    ) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
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

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Error fetching request', {
      email,
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
    return NextResponse.json(
      { error: 'Error fetching request' },
      { status: 500 },
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

  const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    throw new Error('Unauthorized: No session cookie found');
  }

  const decodedClaim = (await getAuth().verifySessionCookie(
    sessionCookie,
  )) as unknown as DecodedClaim;

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
    const requestData = await req.json();

    // Destructure and ignore log field using _
    const { log: _, ...updatedRequest } = requestData;

    await docRef.update(updatedRequest);

    const changes = detectChanges(currentRequest, updatedRequest, decodedClaim);
    if (changes.length > 0) {
      await updateRequestLog({
        logId: currentRequest.logId,
        newChanges: changes,
      });
      await sendEmailUpdateNotification({ changes, request: currentRequest });
    }

    logger.info('Request updated successfully', {
      email: decodedClaim.email,
      tenantId: decodedClaim.tenantId,
      tenantType: decodedClaim.tenantType,
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
      email: decodedClaim.email,
      tenantId: decodedClaim.tenantId,
      tenantType: decodedClaim.tenantType,
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
