import React from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { TablePagination } from '../pagination';
import RequestRow from './table-row';
import { TableRowAnimationProvider } from './animation-context';
import { TableRowSkeleton } from '@/components/ui/spinner';

export type CustomColumnMeta = {
  isCustomerInfo?: boolean;
  isHighlightable?: boolean;
  className?: string;
  isSticky?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomColumnDef<T> = ColumnDef<T, any> & {
  meta?: CustomColumnMeta;
};

interface GenericTableProps<T extends { id: string }> {
  data: T[];
  columns: CustomColumnDef<T>[];
  defaultSort: { id: string; desc: boolean }[];
  EmptyComponent?: React.ComponentType;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  columnVisibility?: VisibilityState;
  totalCount?: number;
  currentPage: number;
  nextCursor: string | null | undefined;
  cursors: (string | null)[];
  onPageChange: (cursor: string | null | undefined, page: number) => void;
  isLoading?: boolean;
}

const GenericTable = <T extends { id: string }>({
  data,
  columns,
  defaultSort,
  EmptyComponent,
  onRowClick,
  pageSize = 10,
  columnVisibility,
  totalCount,
  currentPage,
  nextCursor,
  cursors,
  onPageChange,
  isLoading,
}: GenericTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: defaultSort,
      columnVisibility,
    },
    getRowId: row => row.id,
  });

  console.log('data', data);
  console.log('columns', columns);
  if (data.length === 0 && EmptyComponent) {
    return <EmptyComponent />;
  }

  return (
    <TableRowAnimationProvider>
      <div className="grid gap-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const meta = header.column.columnDef
                      .meta as CustomColumnMeta;
                    const width = header.column.getSize();
                    const headerClassName = clsx(
                      'p-4 whitespace-nowrap',
                      {
                        'bg-yellow-50': meta?.isHighlightable,
                        'sticky right-0 z-10 bg-white': meta?.isSticky,
                        'before:absolute before:content-[""] before:top-0 before:left-0 before:w-4 before:h-full before:shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] before:z-[-1]':
                          meta?.isSticky,
                      },
                      meta?.className ?? 'text-left',
                    );
                    return (
                      <th
                        key={header.id}
                        className={headerClassName}
                        style={{
                          width: `${width}px`,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="relative">
              {isLoading
                ? [...Array(pageSize)].map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td colSpan={columns.length}>
                        <TableRowSkeleton />
                      </td>
                    </tr>
                  ))
                : table
                    .getRowModel()
                    .rows.map(row => (
                      <RequestRow
                        key={row.id}
                        row={row}
                        toggleDrawer={() =>
                          onRowClick && onRowClick(row.original)
                        }
                      />
                    ))}
            </tbody>
          </table>
        </div>
        {totalCount && totalCount > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            nextCursor={nextCursor}
            cursors={cursors}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </TableRowAnimationProvider>
  );
};

export default GenericTable;
