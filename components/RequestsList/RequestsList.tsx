// file: components/RequestsList/RequestsList.tsx
'use client';
import RequestsTable from '@/components/RequestsTable/RequestsTable';
import { useRequests } from '@/hooks/useRequests';
import Filters from '../Filters/Filters';
import { useAuth } from '@/hooks/useAuth';

const RequestsList: React.FC = () => {
  const { userData } = useAuth();
  const { tenantType, tenantId } = userData || {};

  const { requests, isLoading, filters, pagination } = useRequests({
    tenantType,
    tenantId,
  });

  if (!requests || !tenantType || !tenantId) return null;

  return (
    <div className="flex w-full bg-gray-50">
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <div>
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-0">
            <h1 className="text-3xl font-semibold text-gray-900">
              All requests
            </h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Filters</h2>
            <Filters {...filters} showSearchId={true} />
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <RequestsTable
              requests={requests}
              defaultSort={[{ id: 'dateResponded', desc: true }]}
              isLoading={isLoading}
              totalCount={pagination.totalCount}
              cursor={pagination.cursor}
              nextCursor={pagination.nextCursor}
              onPageChange={pagination.handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsList;
