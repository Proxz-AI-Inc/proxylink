'use client';
import { Product } from '@/lib/api/product';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@tremor/react';
import { toDollars } from '@/utils/stripe';

interface ProductCardProps {
  product: Product;
  onProductSelect?: (product: Product) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductSelect,
  isLoading,
  isDisabled,
}) => {
  const { userData } = useAuth();
  const { name, description, default_price, metadata } = product;
  const price = toDollars(default_price.unit_amount);

  if (product.id === 'enterprise') {
    return (
      <Card decoration="left" decorationColor="blue" className="w-fit max-w-sm">
        <div className="flex flex-col h-full">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
            <p className="text-gray-600 mb-6">{description}</p>
          </div>
          <div className="flex flex-col justify-end gap-4 flex-1">
            <p className="text-xl font-semibold text-gray-600">
              {metadata.credits}
              <span> credits</span>
            </p>
            <p className="text-lg font-semibold text-gray-900">Custom</p>
            <Link href="/schedule-demo">
              <Button color="blue" className="w-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  const handleClick = () => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  return (
    <Card decoration="left" decorationColor="blue" className="w-fit max-w-sm">
      <div className="flex flex-col h-full">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
        </div>
        <div className="flex flex-col justify-end gap-4 flex-1">
          <p className="text-xl font-semibold text-gray-600">
            {metadata.credits}
            <span> credits</span>
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ${price.toFixed(2)}{' '}
            <span className="font-normal text-gray-500">
              {default_price.currency.toUpperCase()}
            </span>
          </p>
          <Button
            color="blue"
            onClick={handleClick}
            disabled={!userData || isDisabled}
            loading={isLoading}
          >
            Select Package
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
