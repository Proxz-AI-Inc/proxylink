import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { Transaction } from '@/lib/api/transaction';
import { v4 as uuidv4 } from 'uuid';

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
    if (!sig) throw new Error('Stripe signature is missing.');

    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const tenantId = session.client_reference_id;
      if (!tenantId) {
        return NextResponse.json(
          { error: 'No tenant ID found' },
          { status: 400 },
        );
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ['data.price.product'],
        },
      );

      let totalCredits = 0;
      for (const item of lineItems.data) {
        if (
          item.price?.product &&
          typeof item.price.product === 'object' &&
          !('deleted' in item.price.product)
        ) {
          const product = item.price.product as Stripe.Product;
          const credits = parseInt(product.metadata?.credits || '0', 10);
          totalCredits += credits * (item.quantity || 1);
        }
      }

      if (totalCredits > 0) {
        const tenantRef = db.collection('tenants').doc(tenantId);
        const updateData = {
          credits: FieldValue.increment(totalCredits),
          customerIds: FieldValue.arrayUnion(session.customer || ''),
        };
        console.log('Updating tenant with credits', updateData.credits);
        const transaction: Transaction = {
          id: uuidv4(),
          sessionId: session.id,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? 'usd',
          customerEmail: session.customer_details?.email ?? '',
          paymentStatus: session.payment_status,
          createdAt: session.created,
          tenantId,
          credits: totalCredits,
        };

        // Add transaction to a subcollection
        await tenantRef.collection('transactions').add(transaction);
        console.log('Saving new transaction', transaction);

        await tenantRef.update(updateData);
        console.log('Tenant data updated and transaction added successfully');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 },
    );
  }
}
