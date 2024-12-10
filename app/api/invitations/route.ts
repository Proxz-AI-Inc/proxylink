import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { collections, Invitation, TenantType } from '@/lib/db/schema';
import { sendEmailInvitation } from '@/lib/email/utils';
import * as logger from '@/lib/logger/logger';

/**
 * Handles GET requests to fetch invitations for a tenant.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the invitations or an error message.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = request.headers.get('x-tenant-type') as TenantType;
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId') ?? 'unknown';

  if (!tenantId) {
    logger.error('Missing tenant ID in GET /api/invitations', {
      email,
      tenantId,
      tenantType,
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
      doc => ({ id: doc.id, ...doc.data() }) as Invitation,
    );

    logger.info('Successfully fetched invitations', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/invitations',
      statusCode: 200,
    });

    return NextResponse.json(invitations);
  } catch (error) {
    logger.error('Failed to fetch invitations', {
      email,
      tenantId,
      tenantType,
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

/**
 * Handles POST requests to create or resend invitations.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the invitation details or an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = request.headers.get('x-tenant-type') as TenantType;

  try {
    const {
      sendTo,
      invitedBy,
      tenantType: inviteTenantType,
      tenantName,
      tenantId,
      isAdmin,
      isResend,
    } = await request.json();

    logger.info('Processing invitation request', {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/invitations',
    });

    initializeFirebaseAdmin();
    const db = getFirestore();
    const invitationsRef = db.collection(collections.invitations);

    try {
      const existingInvitationQuery = await invitationsRef
        .where('email', '==', sendTo)
        .where('tenantId', '==', tenantId)
        .limit(1)
        .get();

      console.log('Checking for existing invitation:', {
        sendTo,
        tenantId,
        isResend,
      });

      if (!existingInvitationQuery.empty && isResend) {
        const existingInvitation = existingInvitationQuery.docs[0];

        console.log('Updating invitation:', {
          email: sendTo,
          tenantId,
          invitedBy,
          timestamp: new Date().toISOString(),
        });

        await existingInvitation.ref.update({
          invitedAt: new Date().toISOString(),
          invitedBy,
        });

        logger.info('Resending existing invitation', {
          email,
          tenantId,
          tenantType,
          method: 'POST',
          route: '/api/invitations',
          statusCode: 200,
        });

        const updatedInvitation = await existingInvitation.ref.get();

        console.log('Attempting to send email with params:', {
          sendTo,
          isAdmin,
          invitedBy,
          tenantType: inviteTenantType,
          tenantName,
          tenantId,
        });

        try {
          await sendEmailInvitation({
            sendTo,
            isAdmin,
            invitedBy,
            tenantType: inviteTenantType,
            tenantName,
            tenantId,
          });
          console.log('Email sent successfully');
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          throw emailError;
        }

        return NextResponse.json({
          id: updatedInvitation.id,
          ...updatedInvitation.data(),
        });
      }

      if (existingInvitationQuery.empty && !isResend) {
        const EXPIRATION_TIME_24H = 24 * 60 * 60 * 1000;
        console.log('Creating new invitation:', {
          sendTo,
          invitedBy,
          tenantType: inviteTenantType,
          tenantName,
          tenantId,
          isAdmin,
        });

        const newInvitationRef = await invitationsRef.add({
          email: sendTo,
          invitedBy,
          tenantType: inviteTenantType,
          tenantName,
          tenantId,
          isAdmin: isAdmin ?? false,
          invitedAt: new Date().toISOString(),
          expiresAt: new Date(
            new Date().getTime() + EXPIRATION_TIME_24H,
          ).toISOString(),
        });

        logger.info('Created new invitation', {
          email,
          tenantId,
          tenantType,
          method: 'POST',
          route: '/api/invitations',
          statusCode: 201,
        });

        const newInvitation = await newInvitationRef.get();

        await sendEmailInvitation({
          sendTo,
          isAdmin,
          invitedBy,
          tenantType: inviteTenantType,
          tenantName,
          tenantId,
        });

        return NextResponse.json({
          id: newInvitation.id,
          ...newInvitation.data(),
        });
      }

      if (!existingInvitationQuery.empty && !isResend) {
        logger.error('Invitation already exists', {
          email,
          tenantId,
          tenantType,
          method: 'POST',
          route: '/api/invitations',
          statusCode: 400,
        });

        return NextResponse.json(
          { error: 'Invitation already exists' },
          { status: 400 },
        );
      }

      logger.error('Invalid invitation request', {
        email,
        tenantId,
        tenantType,
        method: 'POST',
        route: '/api/invitations',
        statusCode: 400,
      });

      return NextResponse.json(
        { error: 'Invalid invitation request' },
        { status: 400 },
      );
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Full error details:', error);
    logger.error('Failed to process invitation', {
      email,
      tenantId: 'unknown',
      tenantType,
      method: 'POST',
      route: '/api/invitations',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      { error: 'Failed to process invitation' },
      { status: 500 },
    );
  }
}
