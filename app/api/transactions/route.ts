import { parseErrorMessage } from '@/utils/general';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new NextResponse(
      JSON.stringify({ error: 'Stripe credentials are not set' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const customerId = req.nextUrl.searchParams.get('customerId');

  if (!customerId) {
    return new NextResponse(
      JSON.stringify({ error: 'Customer ID is required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  try {
    const transactions = await stripe.charges.list({
      customer: customerId,
    });

    const simplifiedTransactions = transactions.data.map(transaction => ({
      date: transaction.created,
      packageName: transaction.description,
      amount: transaction.amount,
      id: transaction.id,
    }));

    return new NextResponse(JSON.stringify(simplifiedTransactions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: parseErrorMessage(error) }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
