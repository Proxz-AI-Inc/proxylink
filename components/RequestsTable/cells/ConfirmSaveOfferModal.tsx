import React, { useState } from 'react';
import { Button, Modal } from '@/components/ui/';
import { Request, RequestStatus } from '@/lib/db/schema';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRequest } from '@/lib/api/request';
import { parseErrorMessage } from '@/utils/general';
import Spinner from '@/components/ui/spinner';

interface ConfirmSaveOfferModalProps {
  isVisible: boolean;
  request: Request | null;
  onClose: () => void;
}

const ConfirmSaveOfferModal: React.FC<ConfirmSaveOfferModalProps> = ({
  isVisible,
  request,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedRequest: Request) => updateRequest(updatedRequest),
    onMutate: async updatedRequest => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['requests'] });

      // Snapshot the previous value
      const previousRequests = queryClient.getQueryData<Request[]>([
        'requests',
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<Request[]>(['requests'], old => {
        return old
          ? old.map(req =>
              req.id === updatedRequest.id ? updatedRequest : req,
            )
          : [];
      });

      // Return a context object with the snapshotted value
      return { previousRequests };
    },
    onError: (err, newRequest, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['requests'], context?.previousRequests);
      setError(parseErrorMessage(err));
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  if (!request) return null;

  const handleConfirm = () => {
    if (!request.saveOffer) {
      setError('Save offer data is missing.');
      return;
    }

    const updatedSaveOffer = {
      ...request.saveOffer,
      dateConfirmed: new Date().toISOString(),
    };

    const updatedRequest = {
      ...request,
      status: 'Save Confirmed' as RequestStatus,
      saveOffer: updatedSaveOffer,
    };

    mutation.mutate(updatedRequest);
  };

  return (
    <Modal
      shown={isVisible}
      onClose={onClose}
      title="Confirm Save Offer"
      size="sm"
      footer={
        <div className="flex justify-end space-x-2">
          <Button color="zinc" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner color="white" /> : 'Confirm'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <IoMdCheckmarkCircleOutline className="text-green-500 text-6xl" />
        <p className="font-semibold my-2">Confirm Save Offer</p>
        <div className="p-4 flex items-start text-gray-600" role="alert">
          <p className="font-bold">
            Are you sure you want to confirm this save offer?
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </Modal>
  );
};

export default ConfirmSaveOfferModal;
