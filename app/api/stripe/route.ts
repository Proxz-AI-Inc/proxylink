// file: app/api/stripe/route.ts
// incoming webhook from stripe that we use to update the credits for a tenant
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { parseErrorMessage } from '@/utils/general';

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not set' },
      { status: 500 },
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    for (const item of lineItems.data) {
      if (item.price?.product) {
        const product = await stripe.products.retrieve(
          typeof item.price.product === 'string'
            ? item.price.product
            : item.price.product.id,
        );
        const credits = parseInt(product.metadata.credits, 10);
        if (isNaN(credits)) {
          return NextResponse.json(
            { error: 'Invalid credits value' },
            { status: 500 },
          );
        }
        const tenantId = session.client_reference_id;

        if (tenantId && credits > 0) {
          const tenantRef = db.collection('tenants').doc(tenantId);
          await tenantRef.update({
            credits: FieldValue.increment(credits),
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
