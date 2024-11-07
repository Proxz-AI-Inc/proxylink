import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';

/**
 * Handles GET requests to fetch active Stripe products.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the products or an error message.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = request.headers.get('x-tenant-id') ?? 'system';
  const tenantType = request.headers.get('x-tenant-type') as TenantType;

  if (!process.env.STRIPE_SECRET_KEY) {
    logger.error('Missing Stripe secret key', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/products',
      statusCode: 500,
    });
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY is not set' },
      { status: 500 },
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    logger.info('Successfully fetched Stripe products', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/products',
      statusCode: 200,
    });

    return NextResponse.json(products);
  } catch (error) {
    logger.error('Failed to fetch Stripe products', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/products',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
