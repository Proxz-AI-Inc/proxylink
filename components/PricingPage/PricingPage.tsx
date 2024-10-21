'use client';

import { fetchProducts, Product } from '@/lib/api/product';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../Settings/CreditsTab/ProductCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function PricingClientPage() {
  const [appError, setAppError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { userData } = useAuth();

  const {
    data: productsResponse,
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (queryLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        An error occurred: {(error as Error).message}
      </div>
    );

  // Sort products by price (lowest first)
  const sortedProducts = [...(productsResponse?.data || [])].sort(
    (a, b) => a.default_price.unit_amount - b.default_price.unit_amount,
  );

  const enterpriseProduct: Product = {
    id: 'enterprise',
    name: 'Enterprise Package',
    description: 'Best for enterprise clients and high-volume users',
    default_price: {
      unit_amount: 10000,
      currency: 'usd',
      id: 'enterprise',
    },
    active: true,
    metadata: {
      description: 'For large teams and organizations',
      credits: '> 10000',
    },
  };

  const createCheckoutSession = async (product: Product) => {
    setSelectedProductId(product.id);
    if (!userData?.tenantId) {
      setAppError('Please log in first to select a package');
      return;
    }
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: product.default_price.id,
          clientReferenceId: userData?.tenantId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      router.push(url); // Redirect to Stripe Checkout using Next.js router
    } catch (error) {
      setAppError(
        'Failed to create checkout session. Reload the page and try again.',
      );
    }
  };

  return (
    <div className="px-4 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">
        Pricing Plans
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center">
        Choose the plan that fits your needs
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {sortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductSelect={createCheckoutSession}
            isLoading={product.id === selectedProductId}
            isDisabled={appError !== null}
          />
        ))}
        <ProductCard key={enterpriseProduct.id} product={enterpriseProduct} />
      </div>
      {(appError || error) && (
        <div className="text-red-600 w-full text-center text-xl mt-4">
          {appError || error}
        </div>
      )}
    </div>
  );
}

export default PricingClientPage;
