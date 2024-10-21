import { useAuth } from '@/hooks/useAuth';
import { FC, useState } from 'react';
import Products from './Products';
import { useTenant } from '@/hooks/useTenant';
import Spinner from '@/components/ui/spinner';
import CheckoutSuccess from '@/app/(public)/components/CheckoutSuccess';
import Transactions from './Transactions';

const MyCreditsTab: FC<{
  isEnabled: boolean;
  checkoutSessionId?: string | null;
}> = ({ isEnabled, checkoutSessionId }) => {
  const { userData } = useAuth();
  const [appError, setAppError] = useState<string | null>(null);

  const { data: tenant, isLoading } = useTenant(userData?.tenantId);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="flex w-full flex-col py-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">
          My Credits: {isLoading ? <Spinner /> : tenant?.credits ?? 0}
        </h2>
        <p className="text-base text-gray-500 mb-4 max-w-prose">
          <span className="font-semibold">
            Top up your credits by buying the package that fits your needs.
          </span>
          <br />
          <span>
            Selecting a package will redirect you to Stripe for payment. After
            that you will be redirected back to this tab and check that credits
            have been added.
          </span>
        </p>
        {checkoutSessionId && <CheckoutSuccess />}
        <Products appError={appError} setAppError={setAppError} />
        <Transactions tenantId={userData?.tenantId} />
      </div>
    </div>
  );
};

export default MyCreditsTab;
