import { Button } from '@/components/ui/button';
import { SaveOffer } from '@/lib/db/schema';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createSaveOffer,
  updateSaveOffer,
  deleteSaveOffer,
} from '@/lib/api/tenant';
import SaveOfferCard from './SaveOfferCard';
import DynamicSaveOfferSection from './DynamicSaveOfferSection';
import { Card } from '@tremor/react';

type SaveOffersTabProps = {
  isAdmin: boolean;
  offers?: SaveOffer[];
  tenantId: string;
  refetch: () => void;
  isEnabled: boolean;
};

const SaveOffersTab: React.FC<SaveOffersTabProps> = ({
  isAdmin,
  offers = [],
  tenantId,
  isEnabled,
}) => {
  const [selectedOffer, setSelectedOffer] = useState<SaveOffer | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newOffer: Partial<SaveOffer>) =>
      createSaveOffer(tenantId, newOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      toast.success('Offer created successfully', { duration: 2000 });
      closeEditingModal();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedOffer: SaveOffer) =>
      updateSaveOffer(tenantId, updatedOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      toast.success('Offer updated successfully', { duration: 2000 });
      closeEditingModal();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (offerId: string) => deleteSaveOffer(tenantId, offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      toast.success('Offer deleted successfully', { duration: 2000 });
      closeEditingModal();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCreateNewOffer = () => {
    setIsEditModalVisible(true);
  };

  const handleEditOffer = (offer: SaveOffer) => {
    setSelectedOffer(offer);
    setIsEditModalVisible(true);
  };

  const closeEditingModal = () => {
    setIsEditModalVisible(false);
    setSelectedOffer(null);
  };

  const handleDeleteClick = (offer: SaveOffer) => {
    setSelectedOffer(offer);
    setIsDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setSelectedOffer(null);
  };

  const onDelete = (id: string) => {
    setSelectedOffer(null);
    deleteMutation.mutate(id);
  };

  const onSave = async (offer: Partial<SaveOffer>) => {
    if (offer.id) {
      updateMutation.mutate(offer as SaveOffer);
    } else {
      createMutation.mutate(offer);
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="h-full w-full pt-8">
      <div className="flex flex-col gap-4">
        <h2>Current Offers </h2>
        <div className="flex flex-wrap gap-4">
          {offers.map(offer => (
            <SaveOfferCard
              offer={offer}
              handleEditOffer={handleEditOffer}
              isAdmin={isAdmin}
              handleDeleteClick={handleDeleteClick}
              key={offer.id}
            />
          ))}
          <Card
            className="w-full max-w-sm items-center justify-center flex"
            decoration="left"
            decorationColor="blue"
          >
            <Button
              onClick={handleCreateNewOffer}
              outline={true}
              className="w-fit"
            >
              <FaPlus /> Create New
            </Button>
          </Card>
        </div>
        <div>
          <DynamicSaveOfferSection />
        </div>
      </div>
      <DeleteModal
        isVisible={isDeleteModalVisible}
        offer={selectedOffer}
        onClose={closeDeleteModal}
        onDelete={onDelete}
      />
      <EditModal
        isVisible={isEditModalVisible}
        offer={selectedOffer}
        onClose={closeEditingModal}
        onSave={onSave}
      />
    </div>
  );
};

export default SaveOffersTab;
