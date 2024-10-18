import ProductCard from './ProductCard';
import Spinner from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { fetchProducts, Product } from '@/lib/api/product';
import { parseErrorMessage } from '@/utils/general';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

type Props = {
  appError: string | null;
  setAppError: (error: string) => void;
};

const Products: FC<Props> = ({ appError, setAppError }) => {
  const router = useRouter();
  const { userData } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

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
      router.push(url);
    } catch (error) {
      setAppError(
        'Failed to create checkout session. Reload the page and try again.',
      );
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProductId(product.id);
    createCheckoutSession(product);
  };

  return (
    <>
      {isLoading && (
        <div className="text-center py-10 flex items-center gap-4">
          <Spinner />
          Loading Packages...
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mr-auto">
        {sortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductSelect={handleProductSelect}
            isLoading={product.id === selectedProductId}
            isDisabled={appError !== null}
          />
        ))}
        {!isLoading && (
          <ProductCard key={enterpriseProduct.id} product={enterpriseProduct} />
        )}
      </div>
      {(appError || error) && (
        <div className="text-red-600 w-full text-center text-xl mt-4">
          {appError || parseErrorMessage(error)}
        </div>
      )}
    </>
  );
};

export default Products;
