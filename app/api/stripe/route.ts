import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Stripe credentials are not set' },
        { status: 500 },
      );
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-09-30.acacia',
    });
    console.log('Stripe webhook received');

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

    console.log(
      'Verifying Stripe webhook signature with secret',
      process.env.STRIPE_WEBHOOK_SECRET,
      'buf',
      buf,
      'signature',
      sig,
    );
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(`Received event type: ${event.type}`);

    if (event.type === 'invoice.payment_succeeded') {
      console.log('Processing invoice.payment_succeeded event');
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice data:', JSON.stringify(invoice, null, 2));

      const charge = await stripe.charges.retrieve(invoice.charge as string);
      console.log('Charge data:', JSON.stringify(charge, null, 2));

      const sessionId = charge.metadata.checkout_session_id;
      console.log('Session ID:', sessionId);

      const session = await stripe.checkout.sessions.retrieve(sessionId);
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

      const customerId =
        typeof session.customer === 'string' ? session.customer : null;

      if (!customerId) {
        console.error('No customer ID found in the checkout session');
        return NextResponse.json(
          { error: 'No customer ID found' },
          { status: 400 },
        );
      }
      console.log('Customer ID:', customerId);

      const lineItems = await stripe.invoiceItems.list({
        invoice: invoice.id,
      });
      console.log('Line items:', JSON.stringify(lineItems, null, 2));

      let totalCredits = 0;

      for (const item of lineItems.data) {
        if (item.price?.product) {
          const product = await stripe.products.retrieve(
            typeof item.price.product === 'string'
              ? item.price.product
              : item.price.product.id,
          );
          console.log('Product data:', JSON.stringify(product, null, 2));
          const credits = parseInt(product.metadata.credits || '0', 10);
          totalCredits += credits * (item.quantity || 1);
        }
      }

      console.log('Total credits to add:', totalCredits);

      if (totalCredits > 0) {
        const tenantRef = db.collection('tenants').doc(tenantId);
        const updateData = {
          credits: FieldValue.increment(totalCredits),
          customerId: customerId,
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
