'use client';

import { fetchProducts, Product } from '@/lib/api/product';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';

function PricingClientPage() {
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
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
    name: 'Enterprise Package > 10 000 Credits',
    description: 'Best for enterprise clients and high-volume users',
    default_price: {
      unit_amount: 10000,
      currency: 'usd',
    },
    active: true,
    metadata: {
      description: 'For large teams and organizations',
    },
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
          <ProductCard key={product.id} product={product} />
        ))}
        <ProductCard key={enterpriseProduct.id} product={enterpriseProduct} />
      </div>
    </div>
  );
}

export default PricingClientPage;
