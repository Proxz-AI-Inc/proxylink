'use client';
import { Product } from '@/lib/api/product';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onProductSelect?: (product: Product) => void;
  isCreatingCheckoutSession?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductSelect,
  isCreatingCheckoutSession,
}) => {
  const { userData } = useAuth();
  const { name, description, default_price, metadata } = product;
  const price = default_price.unit_amount / 100;

  if (product.id === 'enterprise') {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
        </div>
        <div className="flex flex-col justify-between min-h-40 pt-6">
          <p className="text-xl font-semibold text-gray-600">
            {metadata.credits}
            <span> credits</span>
          </p>
          <p className="text-4xl font-semibold text-gray-900">Custom</p>
          <Link href="/schedule-demo">
            <Button color="blue" className="w-full">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      <div className="flex flex-col justify-between min-h-40 pt-6 gap-4">
        <p className="text-xl font-semibold text-gray-600">
          {metadata.credits}
          <span> credits</span>
        </p>
        <p className="text-4xl font-semibold text-gray-900">
          ${price.toFixed(2)}{' '}
          <span className="text-xl font-normal text-gray-500">
            {default_price.currency.toUpperCase()}
          </span>
        </p>

        {!userData && (
          <Badge color="amber">Please log in first to select a package</Badge>
        )}

        <Button
          color="blue"
          onClick={handleClick}
          disabled={isCreatingCheckoutSession || !userData}
          loading={isCreatingCheckoutSession}
        >
          Select Package
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
