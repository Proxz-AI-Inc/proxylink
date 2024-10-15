// file: app/api/stripe/route.ts
// incoming webhook from stripe that we use to update the credits for a tenant
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { parseErrorMessage } from '@/utils/general';

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not set' },
      { status: 500 },
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('STRIPE_SECRET_KEY is not set');
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY is not set' },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  initializeFirebaseAdmin();
  const db = getFirestore();
  const buf = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'No Stripe signature found' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `Webhook Error: ${parseErrorMessage(err)}` },
      { status: 400 },
    );
  }

  if (event.type === 'invoice.payment_succeeded') {
    console.log(
      'Received invoice.payment_succeeded event:',
      JSON.stringify(event, null, 2),
    );
    const invoice = event.data.object as Stripe.Invoice;

    // Retrieve the checkout session using the invoice's charge ID
    const charge = await stripe.charges.retrieve(invoice.charge as string);
    const sessionId = charge.metadata.checkout_session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Get the tenantId from the client_reference_id
    const tenantId = session.client_reference_id;

    if (!tenantId) {
      console.error('No tenant ID found in the checkout session');
      return NextResponse.json(
        { error: 'No tenant ID found' },
        { status: 400 },
      );
    }

    // Get the line items from the invoice
    const lineItems = await stripe.invoiceItems.list({
      invoice: invoice.id,
    });

    let totalCredits = 0;

    for (const item of lineItems.data) {
      if (item.price?.product) {
        const product = await stripe.products.retrieve(
          typeof item.price.product === 'string'
            ? item.price.product
            : item.price.product.id,
        );
        const credits = parseInt(product.metadata.credits || '0', 10);
        totalCredits += credits * (item.quantity || 1);
      }
    }

    if (totalCredits > 0) {
      const tenantRef = db.collection('tenants').doc(tenantId);
      await tenantRef.update({
        credits: FieldValue.increment(totalCredits),
      });
    }
  }

  return NextResponse.json({ received: true });
}
