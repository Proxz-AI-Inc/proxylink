import { updateRequest } from '@/lib/api/request';
import {
  RequestStatus,
  Request,
  DeclineReason,
  CustomerInfo,
} from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Spinner from '../ui/spinner';
import { getCustomerFieldDisplayName } from '@/utils/template.utils';
import { addParticipantsData } from '../RequestActions/utils';
import { useAuth } from '@/hooks/useAuth';

const FixCustomerInfo: React.FC<{
  request: Request;
  declineReasons: DeclineReason[];
  onFix?: () => void;
}> = ({ request, declineReasons, onFix }) => {
  // type guard function
  function isValidCustomerInfoField(
    field: string,
  ): field is keyof CustomerInfo {
    return field in request.customerInfo;
  }

  // state for new values initialized with the current values of the decline reasons
  const [newValues, setNewValues] = useState<Partial<CustomerInfo>>(() => {
    return declineReasons.reduce((acc, reason) => {
      if (isValidCustomerInfoField(reason.field)) {
        acc[reason.field] = request.customerInfo[reason.field] || '';
      }
      return acc;
    }, {} as Partial<CustomerInfo>);
  });
  const [updateError, setUpdateError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { userData } = useAuth();

  const mutation = useMutation({
    mutationFn: (updatedCustomerInfo: Partial<CustomerInfo>) => {
      const updatedRequest = {
        ...request,
        customerInfo: {
          ...request.customerInfo,
          ...updatedCustomerInfo,
        },
        status: 'Pending' as RequestStatus,
        declineReason: null,
        successfullyResolved: null,
        participants: addParticipantsData(userData, request),
      };
      console.log('updatedRequest', JSON.stringify(updatedRequest, null, 2));
      return updateRequest(updatedRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', request.id] });
      onFix?.();
    },
    onError: error => {
      setUpdateError(error.message);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setNewValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    mutation.mutate(newValues);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-2xl font-bold">
          Action Required: Fix Customer Info
        </h2>
      </div>
      <p className="text-lg mb-4">
        The customer information provided for this request is incorrect.
        <br />
        Please verify and update the following fields:
      </p>
      {declineReasons.map(reason => (
        <div key={reason.field} className="mb-4">
          <p className="font-semibold text-lg mb-2">
            {getCustomerFieldDisplayName(reason.field)}
          </p>
          <div className="py-4 bg-white text-gray-800 rounded p-4 flex items-start gap-4">
            <div className="w-1/2">
              <p className="font-medium">Current value</p>
              <p className="text-red-500 mt-4">
                {reason.value === '' ? 'empty' : reason.value}
              </p>
            </div>
            <div className="w-1/2">
              <label>
                New value
                <input
                  type="text"
                  className="w-full px-2 border border-gray-300 rounded mt-2"
                  value={
                    isValidCustomerInfoField(reason.field)
                      ? newValues[reason.field] || ''
                      : ''
                  }
                  onChange={e =>
                    handleInputChange(reason.field, e.target.value)
                  }
                />
              </label>
            </div>
          </div>
        </div>
      ))}
      <Button
        onClick={handleSubmit}
        disabled={Object.keys(newValues).length === 0}
        className="mt-4"
      >
        {mutation.isPending ? <Spinner color="white" /> : 'Submit Info'}
      </Button>
      {updateError && (
        <p className="text-red-500 text-sm mt-1">{updateError}</p>
      )}
    </div>
  );
};

export default FixCustomerInfo;
