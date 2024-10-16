import { Suspense } from 'react';
import CheckoutSuccess from '../components/CheckoutSuccess';
import { Loader } from '@/components/ui/spinner';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CheckoutSuccess />
    </Suspense>
  );
}
