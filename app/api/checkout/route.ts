import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
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

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 },
      );
    }

    if (!clientReferenceId) {
      return NextResponse.json(
        { error: 'Client reference ID is required' },
        { status: 400 },
      );
    }

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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Missing Stripe secret key' },
      { status: 500 },
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
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

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: 'Error retrieving session details' },
      { status: 500 },
    );
  }
}
