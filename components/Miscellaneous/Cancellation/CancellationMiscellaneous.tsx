import { useAuth } from '@/hooks/useAuth';
import { FC } from 'react';
import { Request } from '@/lib/db/schema';

const CancellationMiscellaneous: FC<{ request: Request }> = ({ request }) => {
  const { userData } = useAuth();
  const isProviderUser = userData?.tenantType === 'provider';
  const requestStatus = request.status;
  const hasSaveOfferInStatus = [
    'Save Offered',
    'Save Accepted',
    'Save Confirmed',
    'Save Declined',
  ].includes(requestStatus);

  if (!hasSaveOfferInStatus) {
    return null;
  }

  if (isProviderUser) {
    if (requestStatus === 'Save Declined') {
      return (
        <div>
          <p className="text-red-500">Save declined</p>
          <p>Proceed to cancel subscription</p>
        </div>
      );
    }

    if (requestStatus === 'Save Accepted') {
      return (
        <div>
          <p className="text-green-500">Save accepted</p>
          <p>Proceed to apply save offer</p>
        </div>
      );
    }

    if (requestStatus === 'Save Offered') {
      return (
        <div>
          <p className="text-blue-500">Waiting decision</p>
        </div>
      );
    }

    if (requestStatus === 'Save Confirmed') {
      return (
        <div>
          <p className="text-green-500">Save applied</p>
        </div>
      );
    }

    if (requestStatus === 'Canceled' || requestStatus === 'Declined') {
      return '';
    }
  }
};

export default CancellationMiscellaneous;