import { Request } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Row } from '@tanstack/react-table';

const CTACell: React.FC<{
  row: Row<Request>;
  toggleDrawer: (request: Request) => void;
}> = ({ row, toggleDrawer }) => {
  const { userData } = useAuth();
  const isProxyUser = userData?.tenantType === 'proxy';
  const requestStatus = row.original.status;
  const handleClick = () => {
    toggleDrawer(row.original);
  };

  if (isProxyUser) {
    if (requestStatus === 'Declined') {
      return (
        <div onClick={e => e.stopPropagation()}>
          <Button onClick={handleClick} color="primary">
            Fix Data
          </Button>
        </div>
      );
    }

    if (requestStatus === 'Save Offered') {
      return (
        <div onClick={e => e.stopPropagation()}>
          <Button onClick={handleClick} color="primary">
            View Offer
          </Button>
        </div>
      );
    }
  }

  return null;
};

export default CTACell;
