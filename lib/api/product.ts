export interface Product {
  id: string;
  name: string;
  description: string | null;
  default_price: {
    unit_amount: number;
    currency: string;
  };
  active: boolean;
  metadata: Record<string, string>;
}

export interface ProductResponse {
  data: Product[];
}

export const fetchProducts = async (): Promise<ProductResponse> => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};
