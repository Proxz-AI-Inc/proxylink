'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderDetails, OrderDetails } from '@/lib/api/product';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { data, isLoading, error } = useQuery<OrderDetails>({
    queryKey: ['orderDetails', sessionId],
    queryFn: () => fetchOrderDetails(sessionId),
    enabled: !!sessionId,
  });

  if (isLoading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>Error loading order details. Please try again later.</div>;
  }

  return (
    <div className="flex flex-col p-4">
      <div className="p-8 rounded-lg border border-gray-200 w-full text-center">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Thank you for your purchase!
        </h2>
        <p className="mt-2 text-base text-gray-600">
          Your order has been successfully processed.
        </p>
        {data && (
          <div className="mt-4 space-y-2">
            <p className="text-base font-bold text-gray-600">
              Amount:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: data.currency,
              }).format(data.amount)}
            </p>
            <p className="text-base font-bold text-gray-600">
              Status: {data.status}
            </p>
            {data.customerEmail && (
              <p className="text-base font-bold text-gray-600">
                Email: {data.customerEmail}
              </p>
            )}
            <p className="text-sm text-gray-300">Order ID: {data.id}</p>
          </div>
        )}
        <div className="mt-6">
          <Link href="/login">
            <Button color="blue">Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
