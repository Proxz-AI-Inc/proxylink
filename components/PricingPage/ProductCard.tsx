import { Product } from '@/lib/api/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, description, default_price } = product;
  const price = default_price.unit_amount / 100;

  if (product.id === 'enterprise') {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
        </div>
        <div className="flex flex-col justify-between min-h-40 pt-6">
          <p className="text-4xl font-semibold text-gray-900">Custom</p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Contact Us
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      <div className="flex flex-col justify-between min-h-40 pt-6">
        <p className="text-4xl font-semibold text-gray-900">
          ${price.toFixed(2)}{' '}
          <span className="text-sm font-normal text-gray-500">
            {default_price.currency.toUpperCase()}
          </span>
        </p>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
          Select Package
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
