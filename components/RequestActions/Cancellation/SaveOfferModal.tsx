import React, { useState, useMemo } from 'react';
import { Modal, Button } from '@/components/ui/';
import { Select as SelectTremor, SelectItem } from '@tremor/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoMdSave } from 'react-icons/io';
import { Request, RequestStatus, SaveOffer } from '@/lib/db/schema';
import { updateRequest } from '@/lib/api/request';
import Spinner from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { useTableRowAnimation } from '@/components/ui/table/animation-context';
import { useTenant } from '@/hooks/useTenant';
import { addParticipantsData } from '../utils';
import toast from 'react-hot-toast';

interface SaveOfferModalProps {
  isVisible: boolean;
  request: Request;
  closeModal: () => void;
}

const SaveOfferModal: React.FC<SaveOfferModalProps> = ({
  isVisible,
  request,
  closeModal,
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const { data: provider } = useTenant(request.providerTenantId);
  const offers = provider?.saveOffers;

  const queryClient = useQueryClient();
  const { userData } = useAuth();
  const { closeRow } = useTableRowAnimation();

  const mutation = useMutation({
    mutationFn: (offer: SaveOffer) => {
      const updatedRequest = {
        ...request,
        status: 'Save Offered' as RequestStatus,
        dateResponded: request.dateResponded ?? new Date().toISOString(),
        saveOffer: { ...offer, dateOffered: new Date().toISOString() },
        participants: addParticipantsData(userData, request),
      };
      return updateRequest(updatedRequest);
    },
    onSuccess: () => {
      toast.success('Save offer successful');
      setSelectedOfferId('');
      closeRow(request.id);
      setTimeout(() => {
        if (userData?.tenantType && userData?.tenantId) {
          queryClient.invalidateQueries({
            queryKey: ['requests', userData.tenantType, userData.tenantId],
          });
        }
      }, 300); // 300 is time for row animation
    },
    onError: error => {
      console.error(error);
      toast.error('Save offer failed');
    },
    onSettled: () => {
      closeModal();
    },
  });

  const selectedOffer = useMemo(() => {
    return offers?.find(o => o.id === selectedOfferId) || null;
  }, [selectedOfferId, offers]);

  const handleSelectChange = (value: string) => {
    setSelectedOfferId(value);
  };

  const handleConfirm = () => {
    console.log('selectedOffer', selectedOffer);
    if (selectedOffer) {
      console.log('mutating');
      mutation.mutate(selectedOffer);
    }
  };

  const options = offers?.map(offer => ({
    value: offer.id,
    label: offer.title,
  }));

  return (
    <Modal shown={isVisible} onClose={closeModal} title="Save Offer">
      <div className="flex flex-col gap-4">
        <p className="text-gray-600">
          Choose a save offer to retain{' '}
          <span className="font-bold">
            {request.customerInfo.customerEmail}
          </span>
          . The selected offer will be applied to their account.
        </p>

        <SelectTremor
          enableClear={false}
          className="w-60"
          placeholder="Select an offer"
          value={selectedOfferId}
          onValueChange={handleSelectChange}
        >
          {options?.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectTremor>
        {selectedOffer && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              What Customer Will See
            </h3>
            <p className="break-words whitespace-pre-wrap">
              {selectedOffer.description}
            </p>
          </div>
        )}
        <div className="flex justify-end space-x-4 mt-4">
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">
            {mutation.isPending ? (
              <Spinner color="white" />
            ) : (
              <>
                <IoMdSave className="text-xl" /> Confirm Offer
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveOfferModal;
