import PricingClientPage from '@/components/PricingPage/PricingPage';
import { Metadata } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api/product';

export const metadata: Metadata = {
  title: 'ProxyLink | Pricing',
};

export default async function PricingPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricingClientPage />
    </HydrationBoundary>
  );
}
