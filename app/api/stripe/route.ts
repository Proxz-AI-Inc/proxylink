import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { Transaction } from '@/lib/api/transaction';
import { v4 as uuidv4 } from 'uuid';
import * as logger from '@/lib/logger/logger';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      logger.error(
        `Missing Stripe credentials, secretKey: ${process.env.STRIPE_SECRET_KEY} webhookSecret: ${process.env.STRIPE_WEBHOOK_SECRET}`,
        {
          email: 'stripe incoming webhook',
          tenantId: 'unknown',
          tenantType: 'unknown',
          method: 'POST',
          route: '/api/stripe',
          statusCode: 500,
        },
      );
      return NextResponse.json(
        { error: 'Stripe credentials are not set' },
        { status: 500 },
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        logger.error('No tenantId === client_reference_id in webhook', {
          email: session.customer_details?.email || 'anonymous',
          tenantId: 'unknown',
          method: 'POST',
          route: '/api/stripe',
          statusCode: 400,
        });
        return NextResponse.json(
          { error: 'No tenant ID found' },
          { status: 400 },
        );
      }

      logger.info(
        `Processing completed checkout with id: ${session.id}, amount: ${session.amount_total}`,
        {
          email: session.customer_details?.email || 'anonymous',
          tenantId,
          method: 'POST',
          route: '/api/stripe',
        },
      );

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
        logger.info(`Updating tenant with credits: ${updateData.credits}`, {
          email: session.customer_details?.email || 'anonymous',
          tenantId,
          method: 'POST',
          route: '/api/stripe',
        });
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

      logger.info(`Credits added successfully, credits: ${totalCredits}`, {
        email: session.customer_details?.email || 'anonymous',
        tenantId,
        method: 'POST',
        route: '/api/stripe',
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error('Stripe incoming webhook processing error', {
      email: 'stripe incoming webhook',
      tenantId: 'unknown',
      tenantType: 'unknown',
      method: 'POST',
      route: '/api/stripe',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 },
    );
  }
}
