'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderDetails, OrderDetails } from '@/lib/api/product';
import { Button } from '@tremor/react';
import { toDollars } from '@/utils/stripe';
import { CheckCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
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

  const handleClose = () => {
    router.replace('/settings?tab=My%20Credits');
  };

  return (
    <div className="flex flex-col bg-green-100 p-4 rounded-lg relative">
      <Button
        size="xl"
        variant="light"
        icon={X}
        onClick={handleClose}
        color="gray"
        className="absolute top-4 right-4"
      />
      <h2 className="text-xl font-bold text-gray-600 flex items-center gap-2">
        <span>
          <CheckCircle />
        </span>
        <span>Your order has been successfully processed.</span>
      </h2>

      {data && (
        <div className="mt-4 space-y-1">
          <p className="text-base text-gray-600 flex items-center gap-2 flex-wrap">
            <span>Amount: </span>
            <span className="font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: data.currency,
              }).format(toDollars(data.amount))}
            </span>
            <span>Status: </span>
            <span className="font-semibold">{data.status}</span>
          </p>
          <p className="text-sm text-gray-500">Order ID: {data.id}</p>
        </div>
      )}
    </div>
  );
}
