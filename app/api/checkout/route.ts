import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { cookies } from 'next/headers';
import * as logger from '@/lib/logger/logger';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Missing Stripe secret key' },
      { status: 500 },
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const cookieStore = cookies();
  const currentSession = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  try {
    const { priceId, quantity, clientReferenceId } = await request.json();

    if (!priceId || !clientReferenceId) {
      logger.error(
        `Missing required fields: priceId: ${priceId} clientReferenceId: ${clientReferenceId}`,
        {
          email: request.user?.email || 'anonymous',
          tenantId: clientReferenceId || 'unknown',
          method: 'POST',
          route: '/api/checkout',
          statusCode: 400,
        },
      );
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    logger.info(
      `Creating checkout session with priceId: ${priceId} and quantity: ${quantity}`,
      {
        email: request.user?.email || 'anonymous',
        tenantId: clientReferenceId,
        method: 'POST',
        route: '/api/checkout',
      },
    );

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      client_reference_id: clientReferenceId,
      success_url: `${request.headers.get('origin')}/settings?tab=My%20Credits&session_id={CHECKOUT_SESSION_ID}&firebase_session=${currentSession}`,
      cancel_url: `${request.headers.get('origin')}/settings?tab=My%20Credits`,
    });

    logger.info(`Checkout session created with id: ${session.id}`, {
      email: request.user?.email || 'anonymous',
      tenantId: clientReferenceId,
      method: 'POST',
      route: '/api/checkout',
      statusCode: 200,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error('Error creating checkout session', {
      email: request.user?.email || 'anonymous',
      tenantId: request.user?.tenantId || 'unknown',
      method: 'POST',
      route: '/api/checkout',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    logger.error('Missing Stripe secret key', {
      email: request.user?.email || 'anonymous',
      tenantId: 'system',
      method: 'GET',
      route: '/api/checkout',
      statusCode: 500,
    });
    return NextResponse.json(
      { error: 'Missing Stripe secret key' },
      { status: 500 },
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    logger.error('Missing session ID', {
      email: request.user?.email || 'anonymous',
      tenantId: 'unknown',
      method: 'GET',
      route: '/api/checkout',
      statusCode: 400,
    });
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderDetails = {
      id: session.id,
      amount: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
    };

    logger.info(
      `Retrieved checkout session with id: ${session.id} and status: ${session.payment_status}`,
      {
        email: request.user?.email || 'anonymous',
        tenantId: session.client_reference_id || 'unknown',
        method: 'GET',
        route: '/api/checkout',
        statusCode: 200,
      },
    );

    return NextResponse.json(orderDetails);
  } catch (error) {
    logger.error(`Error retrieving checkout session with id: ${sessionId}`, {
      email: request.user?.email || 'anonymous',
      tenantId: 'unknown',
      method: 'GET',
      route: '/api/checkout',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { error: 'Error retrieving session details' },
      { status: 500 },
    );
  }
}
