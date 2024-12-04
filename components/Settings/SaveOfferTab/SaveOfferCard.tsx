import { SaveOffer } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Card } from '@tremor/react';
import { FC } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Props {
  offer: SaveOffer;
  handleEditOffer: (offer: SaveOffer) => void;
  isAdmin: boolean;
  handleDeleteClick: (offer: SaveOffer) => void;
}

const SaveOfferCard: FC<Props> = ({
  offer,
  handleEditOffer,
  isAdmin,
  handleDeleteClick,
}) => {
  return (
    <Card
      decoration="left"
      decorationColor="blue"
      key={offer.id}
      className="w-fit max-w-sm"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-end gap-4 mb-4">
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                color="primary"
                onClick={() => handleEditOffer(offer)}
                className="h-6 text-sm"
              >
                <FaEdit />
                <span>Edit</span>
              </Button>
              <Button
                color="rose"
                onClick={() => handleDeleteClick(offer)}
                className="h-6 text-sm"
              >
                <FaTrash />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold leading-6 text-gray-900">
          {offer.title}
        </h3>
        <div>
          <p>{offer.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default SaveOfferCard;
