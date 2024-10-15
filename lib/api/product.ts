export interface Product {
  id: string;
  name: string;
  description: string | null;
  default_price: {
    unit_amount: number;
    currency: string;
    id: string;
  };
  active: boolean;
  metadata: Record<string, string>;
}

export interface ProductResponse {
  data: Product[];
}

export interface OrderDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string | null;
}

export const fetchProducts = async (): Promise<ProductResponse> => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchOrderDetails = async (
  sessionId: string | null,
): Promise<OrderDetails> => {
  if (!sessionId) throw new Error('Session ID is required');
  const response = await fetch(`/api/checkout?session_id=${sessionId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  return response.json();
};
