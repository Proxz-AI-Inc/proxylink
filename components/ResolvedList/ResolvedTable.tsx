// file: components/ResolvedList/ResolvedTable.tsx
'use client';
import React, { FC, useState } from 'react';
import {
  Request,
  RequestStatus as RequestStatusType,
  RequestType,
} from '@/lib/db/schema';
import { Cell } from '@tanstack/react-table';
import { useAuth } from '@/hooks/useAuth';
import { DateCell, TenantCell } from '../RequestsTable/cells/Cell';
import { getTenants } from '@/lib/api/tenant';
import { useQuery } from '@tanstack/react-query';
import RequestDrawer from '../RequestDetails/RequestDrawer';
import EmptyRequestsState from '../RequestsTable/EmptyTable';
import { generateCustomerInfoColumns } from '../RequestsTable/table.utils';
import RequestStatus from '../RequestStatus/RequestStatus';
import DataTable, { CustomColumnDef } from '@/components/ui/table/table';
import { Loader } from '@/components/ui/spinner';
import RequestTypeComponent from '../RequestType/RequestType';

interface Props {
  requests: Request[];
  EmptyComponent?: React.ComponentType;
  isLoading: boolean;
  defaultSort: { id: string; desc: boolean }[];
  totalCount: number;
  currentPage: number;
  nextCursor: string | null | undefined;
  cursors: (string | null)[];
  onPageChange: (cursor: string | null | undefined, page: number) => void;
  pageSize?: number;
}

const ResolvedTable: FC<Props> = ({
  requests,
  EmptyComponent = EmptyRequestsState,
  isLoading,
  defaultSort,
  totalCount,
  currentPage,
  nextCursor,
  cursors,
  onPageChange,
  pageSize = 10,
}) => {
  const { userData } = useAuth();
  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => getTenants({ minimal: true }),
  });
  const isProviderUser = userData?.tenantType === 'provider';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const toggleDrawer = (request: Request) => {
    setIsDrawerOpen(prev => !prev);
    if (request) {
      setSelectedRequest(request);
    } else {
      setSelectedRequest(null);
    }
  };

  const customerInfoColumns = generateCustomerInfoColumns(requests);
  const columns: CustomColumnDef<Request>[] = [
    {
      header: 'Type',
      accessorKey: 'requestType',
      meta: {
        className: 'text-center',
      },
      cell: ({ cell }: { cell: Cell<Request, RequestType> }) => (
        <RequestTypeComponent type={cell.getValue()} />
      ),
    },
    {
      header: 'Status',
      meta: {
        className: 'text-center',
      },
      accessorKey: 'status',
      cell: ({ cell }: { cell: Cell<Request, RequestStatusType> }) => (
        <div className="flex justify-center">
          <RequestStatus status={cell.getValue()} />
        </div>
      ),
      size: 130,
    },
    ...customerInfoColumns,
    {
      header: isProviderUser ? 'Source' : 'Destination',
      accessorKey: isProviderUser ? 'proxyTenantId' : 'providerTenantId',
      cell: ({ cell }: { cell: Cell<Request, string> }) => {
        const name = tenants?.find(
          tenant => tenant.id === cell.getValue(),
        )?.name;
        return <TenantCell name={name} isLoading={tenantsLoading} />;
      },
    },
    {
      header: 'Submitted by',
      accessorKey: 'submittedBy',
    },
    {
      header: 'Last Update',
      accessorKey: 'dateResponded',
      cell: DateCell,
    },
  ];

  if (!userData) return null;

  if (requests.length === 0) {
    return <EmptyComponent />;
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable
          data={requests}
          columns={columns}
          defaultSort={defaultSort}
          EmptyComponent={EmptyComponent}
          onRowClick={toggleDrawer}
          totalCount={totalCount}
          currentPage={currentPage}
          nextCursor={nextCursor}
          cursors={cursors}
          onPageChange={onPageChange}
          pageSize={pageSize}
          isLoading={isLoading}
        />
      )}
      <RequestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        request={selectedRequest}
        drawerPosition="right"
      />
    </>
  );
};

export default ResolvedTable;
