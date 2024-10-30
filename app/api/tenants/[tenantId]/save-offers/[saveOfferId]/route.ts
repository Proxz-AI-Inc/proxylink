// file: app/api/tenants/[id]/save-offers/[id]/routes.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { SaveOffer, Tenant } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';

initializeFirebaseAdmin();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string; saveOfferId: string } },
) {
  const { tenantId, saveOfferId } = params;

  if (!tenantId || !saveOfferId) {
    logger.error('Invalid tenant ID or offer ID', {
      email: request.user?.email || 'anonymous',
      tenantId: tenantId || 'unknown',
      tenantType: 'unknown',
      method: 'PATCH',
      route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
      statusCode: 400,
    });
    return NextResponse.json(
      { message: 'Invalid tenant ID or offer ID' },
      { status: 400 },
    );
  }

  const db: Firestore = getFirestore();
  const tenantRef = db.collection('tenants').doc(tenantId);

  try {
    const updateData: Partial<SaveOffer> = await request.json();

    if (Object.keys(updateData).length === 0) {
      logger.error('No update data provided', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: 'unknown',
        method: 'PATCH',
        route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
        statusCode: 400,
      });
      return NextResponse.json(
        { message: 'No update data provided' },
        { status: 400 },
      );
    }

    const tenantDoc = await tenantRef.get();
    if (!tenantDoc.exists) {
      logger.error('Tenant not found', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: 'unknown',
        method: 'PATCH',
        route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
        statusCode: 404,
      });
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 },
      );
    }

    const tenant = tenantDoc.data() as Tenant;

    if (!tenant.saveOffers) {
      logger.error('No save offers available', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: tenant.type || 'unknown',
        method: 'PATCH',
        route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
        statusCode: 404,
      });
      return NextResponse.json(
        { message: 'No save offers available' },
        { status: 404 },
      );
    }

    const offerIndex = tenant.saveOffers.findIndex(
      offer => offer.id === saveOfferId,
    );
    if (offerIndex === -1) {
      logger.error('Save offer not found', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: tenant.type || 'unknown',
        method: 'PATCH',
        route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
        statusCode: 404,
      });
      return NextResponse.json(
        { message: 'Save offer not found' },
        { status: 404 },
      );
    }

    const updatedOffer = {
      ...tenant.saveOffers[offerIndex],
      ...updateData,
      dateUpdated: new Date().toISOString(),
    };

    const updatedSaveOffers = [...tenant.saveOffers];
    updatedSaveOffers[offerIndex] = updatedOffer;

    await tenantRef.update({
      saveOffers: updatedSaveOffers,
    });

    logger.info('Save offer updated successfully', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: tenant.type || 'unknown',
      method: 'PATCH',
      route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
      statusCode: 200,
    });

    return NextResponse.json(updatedOffer, {
      status: 200,
    });
  } catch (error) {
    logger.error('Error updating save offer', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: 'unknown',
      method: 'PATCH',
      route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; saveOfferId: string } },
) {
  const { tenantId, saveOfferId } = params;

  if (!tenantId || !saveOfferId) {
    logger.error('Invalid tenant ID or offer ID', {
      email: request.user?.email || 'anonymous',
      tenantId: tenantId || 'unknown',
      tenantType: 'unknown',
      method: 'DELETE',
      route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
      statusCode: 400,
    });
    return NextResponse.json(
      { message: 'Invalid tenant ID or offer ID' },
      { status: 400 },
    );
  }

  const db: Firestore = getFirestore();
  const tenantRef = db.collection('tenants').doc(tenantId);

  try {
    const tenantDoc = await tenantRef.get();
    if (!tenantDoc.exists) {
      logger.error('Tenant not found', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: 'unknown',
        method: 'DELETE',
        route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
        statusCode: 404,
      });
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 },
      );
    }

    const tenant = tenantDoc.data() as Tenant;
    const offerExists = tenant.saveOffers?.some(
      offer => offer.id === saveOfferId,
    );

    if (!offerExists) {
      logger.error('Save offer not found', {
        email: request.user?.email || 'anonymous',
        tenantId,
        tenantType: tenant.type || 'unknown',
        method: 'DELETE',
        route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
        statusCode: 404,
      });
      return NextResponse.json(
        { message: 'Error: Save offer not found, contact support' },
        { status: 404 },
      );
    }

    await tenantRef.update({
      saveOffers: FieldValue.arrayRemove(
        tenant.saveOffers?.find(offer => offer.id === saveOfferId),
      ),
    });

    logger.info('Save offer deleted successfully', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: tenant.type || 'unknown',
      method: 'DELETE',
      route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
      statusCode: 200,
    });

    return NextResponse.json(
      { message: 'Save offer deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    logger.error('Error deleting save offer', {
      email: request.user?.email || 'anonymous',
      tenantId,
      tenantType: 'unknown',
      method: 'DELETE',
      route: '/api/tenants/[tenantId]/save-offers/[saveOfferId]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { message: 'Error: Delete failed, contact support' },
      { status: 500 },
    );
  }
}
