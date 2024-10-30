import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { sendEmailInvitation } from '@/lib/email/utils';
import * as logger from '@/lib/logger/logger';

export async function POST(request: NextRequest) {
  try {
    const {
      sendTo,
      invitedBy,
      tenantType,
      tenantName,
      tenantId,
      isAdmin,
      isResend,
    } = await request.json();

    logger.info('Processing invitation request', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: tenantType || 'unknown',
      method: 'POST',
      route: '/api/invite',
    });

    const db = getFirestore();
    const invitationsRef = db.collection('invitations');
    const existingInvitationQuery = await invitationsRef
      .where('email', '==', sendTo)
      .where('tenantId', '==', tenantId)
      .limit(1)
      .get();

    if (!existingInvitationQuery.empty && isResend) {
      const existingInvitation = existingInvitationQuery.docs[0];
      await existingInvitation.ref.update({
        invitedAt: new Date().toISOString(),
        invitedBy,
      });

      logger.info('Resending existing invitation', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: tenantType || 'unknown',
        method: 'POST',
        route: '/api/invite',
        statusCode: 200,
      });

      const updatedInvitation = await existingInvitation.ref.get();

      await sendEmailInvitation({
        sendTo,
        isAdmin,
        invitedBy,
        tenantType,
        tenantName,
        tenantId,
      });

      return NextResponse.json({
        id: updatedInvitation.id,
        ...updatedInvitation.data(),
      });
    }

    if (existingInvitationQuery.empty && !isResend) {
      const EXPIRATION_TIME_24H = 24 * 60 * 60 * 1000;
      const newInvitationRef = await invitationsRef.add({
        email: sendTo,
        invitedBy,
        tenantType,
        tenantName,
        tenantId,
        isAdmin: isAdmin ?? false,
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(
          new Date().getTime() + EXPIRATION_TIME_24H,
        ).toISOString(),
      });

      logger.info('Created new invitation', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: tenantType || 'unknown',
        method: 'POST',
        route: '/api/invite',
        statusCode: 201,
      });

      const newInvitation = await newInvitationRef.get();

      await sendEmailInvitation({
        sendTo,
        isAdmin,
        invitedBy,
        tenantType,
        tenantName,
        tenantId,
      });

      return NextResponse.json({
        id: newInvitation.id,
        ...newInvitation.data(),
      });
    } else if (!existingInvitationQuery.empty && !isResend) {
      logger.error('Invitation already exists', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: tenantType || 'unknown',
        method: 'POST',
        route: '/api/invite',
        statusCode: 400,
      });

      return NextResponse.json(
        { error: 'Invitation already exists' },
        { status: 400 },
      );
    } else {
      logger.error('Invitation not found', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: tenantType || 'unknown',
        method: 'POST',
        route: '/api/invite',
        statusCode: 404,
      });

      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 },
      );
    }
  } catch (error) {
    logger.error('Failed to process invitation', {
      email: request.user?.email || 'anonymous',
      tenantId: 'unknown',
      tenantType: 'unknown',
      method: 'POST',
      route: '/api/invite',
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
