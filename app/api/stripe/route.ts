import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getCreditsFromLineItems } from '@/utils/stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Stripe credentials are not set' },
        { status: 500 },
      );
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Stripe credentials are not set' },
        { status: 500 },
      );
    }

    initializeFirebaseAdmin();
    const db = getFirestore();

    const buf = await req.text();
    const sig = req.headers.get('stripe-signature');
    if (typeof sig !== 'string') {
      throw new Error('Stripe signature is missing.');
    }
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(`Received event type: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout.session.completed event');
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Session data:', JSON.stringify(session, null, 2));

      const tenantId = session.client_reference_id;
      if (!tenantId) {
        console.error('No tenant ID found in the checkout session');
        return NextResponse.json(
          { error: 'No tenant ID found' },
          { status: 400 },
        );
      }
      console.log('Tenant ID:', tenantId);

      const customerId = session.customer;
      if (!customerId) {
        console.error('No customer ID found in the checkout session');
        return NextResponse.json(
          { error: 'No customer ID found' },
          { status: 400 },
        );
      }
      console.log('Customer ID:', customerId);

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
      console.log('Line items:', JSON.stringify(lineItems, null, 2));

      const totalCredits = await getCreditsFromLineItems(
        stripe,
        lineItems.data,
      );
      console.log('Total credits to add:', totalCredits);

      if (totalCredits > 0) {
        const tenantRef = db.collection('tenants').doc(tenantId);
        const updateData = {
          credits: FieldValue.increment(totalCredits),
          ...(customerId ? { customerId } : {}),
        };

        console.log(
          'Updating tenant data:',
          JSON.stringify(updateData, null, 2),
        );
        await tenantRef.update(updateData);
        console.log('Tenant data updated successfully');
      } else {
        console.log('No credits to add, skipping tenant update');
      }
    }

    console.log('Webhook processed successfully');
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return NextResponse.json(
      { error: 'Error processing Stripe webhook' },
      { status: 500 },
    );
  }
}
