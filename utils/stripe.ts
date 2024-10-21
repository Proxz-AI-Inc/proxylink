import Stripe from 'stripe';

export const toCents = (amount: number): number => Math.round(amount * 100);
export const toDollars = (amount: number): number => amount / 100;

export async function getCreditsFromLineItems(
  stripe: Stripe,
  lineItems: Stripe.LineItem[],
): Promise<number> {
  let totalCredits = 0;

  for (const item of lineItems) {
    if (item.price?.product) {
      let productId: string;
      if (typeof item.price.product === 'string') {
        productId = item.price.product;
      } else if (
        typeof item.price.product === 'object' &&
        'id' in item.price.product
      ) {
        productId = item.price.product.id;
      } else {
        console.error('Unexpected product format:', item.price.product);
        continue;
      }

      const product = await stripe.products.retrieve(productId);
      console.log('Product data:', JSON.stringify(product, null, 2));
      const credits = parseInt(product.metadata.credits || '0', 10);
      totalCredits += credits * (item.quantity || 1);
    }
  }

  return totalCredits;
}
