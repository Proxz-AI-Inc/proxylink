import { NextRequest, NextResponse } from 'next/server';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { parseErrorMessage } from '@/utils/general';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';
import { CollectionReference } from 'firebase-admin/firestore';

type DeleteError = {
  userId: string;
  error: string;
};

type DeleteResults = {
  success: {
    users: number;
    auth: number;
  };
  failures: {
    users: DeleteError[];
    auth: DeleteError[];
  };
};

type DeleteCollectionParams = {
  db: Firestore;
  collectionRef: CollectionReference;
  batchSize: number;
  results: DeleteResults;
  logger: typeof import('@/lib/logger/logger');
  metadata: { email: string; tenantId: string; tenantType: TenantType };
};

/**
 * Recursively deletes all sub-collections and documents within a collection
 */
async function deleteCollectionRecursively(
  params: DeleteCollectionParams,
): Promise<void> {
  const { db, collectionRef, batchSize, results, logger, metadata } = params;
  const query = collectionRef.limit(batchSize);

  while (true) {
    const snapshot = await query.get();
    if (snapshot.empty) break;

    const batch = db.batch();
    let operationCount = 0;

    for (const doc of snapshot.docs) {
      const subCollections = await doc.ref.listCollections();

      for (const subCollection of subCollections) {
        await deleteCollectionRecursively({
          db,
          collectionRef: subCollection,
          batchSize,
          results,
          logger,
          metadata,
        });
      }

      batch.delete(doc.ref);
      operationCount++;
    }

    if (operationCount > 0) {
      try {
        await batch.commit();
        results.success.users += operationCount;
      } catch (error) {
        logger.error('Failed to delete batch of documents', {
          ...metadata,
          error: { message: parseErrorMessage(error) },
        });
        results.failures.users.push({
          userId: 'batch',
          error: parseErrorMessage(error),
        });
      }
    }

    if (snapshot.docs.length < batchSize) break;
  }
}

/**
 * Handles DELETE requests to remove an organization and its associated users.
 * @param {NextRequest} request - The incoming request object.
 * @param {Object} params - URL parameters containing organization ID.
 * @returns {Promise<NextResponse>} A response indicating deletion success or failure.
 */
type Params = Promise<{ id: string }>;
export async function DELETE(
  request: NextRequest,
  segmentData: { params: Params },
): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const params = await segmentData.params;
  const tenantId = params.id;
  const tenantType =
    (request.headers.get('x-tenant-type') as TenantType) ?? 'management';
  const BATCH_SIZE = 500;

  const cookiesStore = await cookies();
  const sessionCookie = cookiesStore.get(AUTH_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    logger.error('DELETE org attempt without session cookie', {
      email,
      tenantId,
      tenantType,
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode: 400,
    });
    return NextResponse.json({ error: 'No session cookie' }, { status: 400 });
  }

  try {
    const auth = getAuth();
    const db: Firestore = getFirestore();

    const results: DeleteResults = {
      success: { users: 0, auth: 0 },
      failures: { users: [], auth: [] },
    };

    // Get all users in batches
    let lastDoc = null;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      let query = db
        .collection('users')
        .where('tenantId', '==', tenantId)
        .limit(BATCH_SIZE);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const usersSnapshot = await query.get();

      if (usersSnapshot.empty) {
        hasMoreUsers = false;
        continue;
      }

      const deletePromises = usersSnapshot.docs.map(async doc => {
        const userId = doc.id;
        try {
          // Delete from Auth
          try {
            await auth.deleteUser(userId);
            results.success.auth++;
          } catch (authError) {
            results.failures.auth.push({
              userId,
              error: parseErrorMessage(authError),
            });
            logger.error('Failed to delete user from Auth', {
              email,
              tenantId,
              tenantType,
              error: { message: parseErrorMessage(authError) },
            });
          }

          // Delete from Firestore
          try {
            await doc.ref.delete();
            results.success.users++;
          } catch (firestoreError) {
            results.failures.users.push({
              userId,
              error: parseErrorMessage(firestoreError),
            });
            logger.error('Failed to delete user from Firestore', {
              email,
              tenantId,
              tenantType,
              error: { message: parseErrorMessage(firestoreError) },
            });
          }
        } catch (error) {
          logger.error('Error in user deletion process', {
            email,
            tenantId,
            tenantType,
            error: { message: parseErrorMessage(error) },
          });
        }
      });

      await Promise.all(deletePromises);
      lastDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
      hasMoreUsers = usersSnapshot.docs.length === BATCH_SIZE;
    }

    // Delete the tenant and all its sub-collections
    try {
      const tenantRef = db.collection('tenants').doc(tenantId);
      const subCollections = await tenantRef.listCollections();

      for (const subCollection of subCollections) {
        await deleteCollectionRecursively({
          db,
          collectionRef: subCollection,
          batchSize: BATCH_SIZE,
          results,
          logger,
          metadata: { email, tenantId, tenantType },
        });
      }

      // Finally delete the tenant document
      await tenantRef.delete();
    } catch (tenantError) {
      logger.error('Failed to delete tenant', {
        email,
        tenantId,
        tenantType,
        method: 'DELETE',
        route: '/api/organizations/[id]',
        statusCode: 500,
        error: { message: parseErrorMessage(tenantError) },
      });

      return NextResponse.json(
        {
          message:
            'Partial success: Organization deletion failed but some data was deleted',
          results,
          error: parseErrorMessage(tenantError),
        },
        { status: 500 },
      );
    }

    const hasFailures =
      results.failures.users.length > 0 || results.failures.auth.length > 0;
    const statusCode = hasFailures ? 207 : 200;

    logger.info('Organization deletion completed', {
      email,
      tenantId,
      tenantType,
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode,
    });

    return NextResponse.json(
      {
        message: hasFailures
          ? 'Organization deleted with some failures'
          : 'Organization and all associated users deleted successfully',
        results,
      },
      { status: statusCode },
    );
  } catch (error) {
    logger.error('Critical error during organization deletion', {
      email,
      tenantId,
      tenantType,
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      {
        message: 'Failed to delete organization',
        error: parseErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
