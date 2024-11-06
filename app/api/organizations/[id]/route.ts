import { parseErrorMessage } from '@/utils/general';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import * as logger from '@/lib/logger/logger';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';

// Add these types at the top of the file
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

export const DELETE = async (
  _: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> => {
  const db: Firestore = getFirestore();
  const auth = getAuth();
  const { id } = params;
  const BATCH_SIZE = 500;
  const sessionCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    logger.error('DELETE org attempt without session cookie', {
      tenantId: 'system',
      email: 'anonymous',
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode: 400,
    });
    return NextResponse.json({ error: 'No session cookie' }, { status: 400 });
  }

  const decodedClaims = await auth.verifySessionCookie(sessionCookie, false);

  try {
    const results: DeleteResults = {
      success: { users: 0, auth: 0 },
      failures: { users: [], auth: [] },
    };

    // Get all users in batches to handle large organizations
    let lastDoc = null;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      let query = db
        .collection('users')
        .where('tenantId', '==', id)
        .limit(BATCH_SIZE);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const usersSnapshot = await query.get();

      if (usersSnapshot.empty) {
        hasMoreUsers = false;
        continue;
      }

      // Process this batch
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
              email: decodedClaims.email || 'anonymous',
              error: { message: parseErrorMessage(authError) },
              tenantId: id,
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
              email: decodedClaims.email || 'anonymous',
              error: { message: parseErrorMessage(firestoreError) },
              tenantId: id,
            });
          }
        } catch (error) {
          logger.error('Error in user deletion process', {
            email: decodedClaims.email || 'anonymous',
            error: { message: parseErrorMessage(error) },
            tenantId: id,
          });
        }
      });

      await Promise.all(deletePromises);
      lastDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];

      // Check if this was the last batch
      if (usersSnapshot.docs.length < BATCH_SIZE) {
        hasMoreUsers = false;
      }
    }

    // Delete the tenant only if all users were processed
    try {
      await db.collection('tenants').doc(id).delete();
    } catch (tenantError) {
      logger.error('Failed to delete tenant', {
        tenantId: id,
        error: { message: parseErrorMessage(tenantError) },
        email: decodedClaims.email || 'anonymous',
      });

      return NextResponse.json(
        {
          message:
            'Partial success: Organization deletion failed but some users were deleted',
          results,
          error: parseErrorMessage(tenantError),
        },
        { status: 500 },
      );
    }

    // Log final results
    logger.info('Organization deletion completed', {
      email: decodedClaims.email || 'anonymous',
      tenantId: id,
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode:
        results.failures.users.length || results.failures.auth.length
          ? 207
          : 200,
    });

    // Return appropriate status based on results
    const hasFailures =
      results.failures.users.length > 0 || results.failures.auth.length > 0;
    return NextResponse.json(
      {
        message: hasFailures
          ? 'Organization deleted with some failures'
          : 'Organization and all associated users deleted successfully',
        results,
      },
      {
        status: hasFailures ? 207 : 200, // 207 Multi-Status for partial success
      },
    );
  } catch (error) {
    logger.error('Critical error during organization deletion', {
      email: decodedClaims.email || 'anonymous',
      tenantId: id,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode: 500,
    });

    return NextResponse.json(
      {
        message: 'Failed to delete organization',
        error: parseErrorMessage(error),
      },
      { status: 500 },
    );
  }
};
