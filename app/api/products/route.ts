import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is not set' },
        { status: 500 },
      );
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
