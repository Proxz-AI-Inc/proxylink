import { FC } from 'react';
import DataTable from '@/components/ui/table/table';
import { Row } from '@tanstack/react-table';
import { Loader } from '@/components/ui/spinner';

import { useQuery } from '@tanstack/react-query';
import { getOrganisations, Organization } from '@/lib/api/organization';
import OrgActions from './OrgActions';
import { useCursorPagination } from '@/hooks/useCursorPagination';

interface OrgTableProps {
  type: 'provider' | 'proxy';
}

const OrgTable: FC<OrgTableProps> = ({ type }) => {
  const { cursor, currentPage, pageNumbers, cursors, handlePageChange } =
    useCursorPagination();
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['organizations', type, cursor],
    queryFn: () => getOrganisations({ type, cursor, limit: pageSize }),
  });

  const columns = [
    {
      header: 'Organization Name',
      accessorKey: 'name',
    },
    {
      header: 'Status',
      cell: ({ row }: { row: Row<Organization> }) => (
        <p className="whitespace-normal break-words">
          {row.original.active ? 'Live' : 'Pending'}
        </p>
      ),
    },
    {
      header: 'User Count',
      accessorKey: 'userCount',
    },
    {
      header: 'Request Count',
      accessorKey: 'requestCount',
    },
    {
      header: 'Authenticating Fields',
      accessorKey: 'requiredCustomerInfo',
      cell: ({ row }: { row: Row<Organization> }) => (
        <p className="whitespace-normal break-words">
          {row.original.requiredCustomerInfo?.join(', ') || '-'}
        </p>
      ),
      size: 200,
    },
    {
      header: 'Connected Organizations',
      accessorKey: 'connectedTenants',
      cell: ({ row }: { row: Row<Organization> }) =>
        row.original.connectedTenants.map(t => t.name).join(', ') || '-',
    },
    {
      header: 'Admin Emails',
      accessorKey: 'adminEmails',
      cell: ({ row }: { row: Row<Organization> }) =>
        row.original.adminEmails?.join(', ') || '-',
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }: { row: Row<Organization> }) => (
        <OrgActions organization={row.original} />
      ),
    },
  ];

  return (
    <div className="p-4 flex flex-col space-y-4 h-full flex-1">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Providers</h2>
          <DataTable
            data={data?.items || []}
            columns={columns}
            defaultSort={[{ id: 'name', desc: false }]}
            totalCount={data?.totalCount ?? 0}
            currentPage={currentPage}
            nextCursor={data?.nextCursor}
            pageNumbers={pageNumbers}
            cursors={cursors}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            isLoading={isLoading}
          />

          <h2 className="text-2xl font-bold mt-8">Proxies</h2>
          <DataTable
            data={data?.items || []}
            columns={columns}
            defaultSort={[{ id: 'name', desc: false }]}
            totalCount={data?.totalCount ?? 0}
            currentPage={currentPage}
            nextCursor={data?.nextCursor}
            pageNumbers={pageNumbers}
            cursors={cursors}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default OrgTable;
