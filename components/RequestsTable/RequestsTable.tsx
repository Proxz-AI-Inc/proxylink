// file: components/RequestsTable/RequestsTable.tsx
'use client';
import React, { FC, useMemo, useState } from 'react';
import {
  Request,
  RequestStatus as RequestStatusType,
  RequestType,
} from '@/lib/db/schema';
import { Row, Cell, VisibilityState } from '@tanstack/react-table';
import { useAuth } from '@/hooks/useAuth';
import { generateCustomerInfoColumns } from './table.utils';
import RequestStatus from '../RequestStatus/RequestStatus';
import EmptyRequestsState from './EmptyTable';
import CTACell from './cells/CTACell';
import RequestDrawer from '../RequestDetails/RequestDrawer';
import DataTable from '../ui/table/table';
import { Loader } from '../ui/spinner';
import RequestTypeComponent from '@/components/RequestType/RequestType';
import RequestActions from '@/components/RequestActions/RequestActions';
import Miscellaneous from '../Miscellaneous/Miscellaneous';

interface Props {
  requests: Request[];
  EmptyComponent?: React.ComponentType;
  isActionsTable?: boolean;
  defaultSort: { id: string; desc: boolean }[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage: number;
  nextCursor: string | null | undefined;
  cursors: (string | null)[];
  onPageChange: (cursor: string | null | undefined, page: number) => void;
  pageSize?: number;
}

const RequestsTable: FC<Props> = ({
  requests,
  EmptyComponent = EmptyRequestsState,
  isActionsTable,
  defaultSort,
  isLoading,
  totalCount,
  currentPage,
  nextCursor,
  cursors,
  onPageChange,
  pageSize = 10,
}) => {
  const { userData } = useAuth();
  const isProviderUser = userData?.tenantType === 'provider';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
    'right',
  );

  const toggleDrawer = (request: Request, position?: 'left' | 'right') => {
    if (position) {
      setDrawerPosition(position);
    } else {
      setDrawerPosition('right');
    }
    setIsDrawerOpen(prev => !prev);
    if (request) {
      setSelectedRequest(request);
    } else {
      setSelectedRequest(null);
    }
  };

  const customerInfoColumns = generateCustomerInfoColumns(requests);
  const columns = useMemo(
    () => [
      ...(isActionsTable && !isProviderUser
        ? [
            {
              header: '',
              accessorKey: 'id',
              meta: {
                className: 'flex justify-center',
              },
              cell: ({ row }: { row: Row<Request> }) => (
                <CTACell row={row} toggleDrawer={toggleDrawer} />
              ),
            },
          ]
        : []),
      {
        header: 'Type',
        accessorKey: 'requestType',
        meta: {
          className: 'text-center',
        },
        cell: ({ cell }: { cell: Cell<Request, RequestType> }) => (
          <RequestTypeComponent type={cell.getValue()} />
        ),
        size: 120,
      },
      {
        header: 'Status',
        meta: {
          className: '',
        },
        accessorKey: 'status',
        cell: ({ cell }: { cell: Cell<Request, RequestStatusType> }) => (
          <div className="flex justify-center">
            <RequestStatus status={cell.getValue()} />
          </div>
        ),
        size: 120,
      },
      ...customerInfoColumns,
      ...(isProviderUser
        ? [
            {
              id: 'Actions',
              header: 'Actions',
              cell: ({ row }: { row: Row<Request> }) => (
                <RequestActions request={row.original} />
              ),
            },
          ]
        : []),
      ...(isProviderUser
        ? [
            {
              header: 'Miscellaneous Info',
              cell: ({ row }: { row: Row<Request> }) => (
                <Miscellaneous request={row.original} />
              ),
            },
          ]
        : []),
      {
        id: 'dateResponded',
        accessorKey: 'dateResponded',
        header: 'Date Responded',
      },
    ],
    [isActionsTable, isProviderUser, customerInfoColumns],
  );

  const columnVisibility: VisibilityState = {
    dateResponded: false,
  };

  if (!userData) return null;

  if (requests.length === 0 && !isLoading) {
    return <EmptyComponent />;
  }

  return (
    <>
      <div className="relative">
        <DataTable<Request>
          data={requests}
          columns={columns}
          defaultSort={defaultSort}
          EmptyComponent={EmptyComponent}
          onRowClick={toggleDrawer}
          columnVisibility={columnVisibility}
          totalCount={totalCount}
          currentPage={currentPage}
          nextCursor={nextCursor}
          cursors={cursors}
          onPageChange={onPageChange}
          pageSize={pageSize}
          isLoading={isLoading}
        />

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="absolute inset-x-0 top-[57px] bottom-0">
              <Loader />
            </div>
          </div>
        )}
      </div>

      <RequestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        request={selectedRequest}
        drawerPosition={drawerPosition}
      />
    </>
  );
};

export default RequestsTable;
