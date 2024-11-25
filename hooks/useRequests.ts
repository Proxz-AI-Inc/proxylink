import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RequestStatus, TenantType } from '@/lib/db/schema';
import { getRequests } from '@/lib/api/request';
import { useRequestFilters } from './useRequestsFilters';
import { useCursorPagination } from './useCursorPagination';

interface UseRequestsProps {
  tenantType: TenantType | undefined;
  tenantId: string | undefined;
  initialStatusFilters?: RequestStatus[];
  showStatusFilter?: boolean;
  showSearchId?: boolean;
  pageSize?: number;
}

export const useRequests = ({
  tenantType,
  tenantId,
  initialStatusFilters,
  showStatusFilter = true,
  showSearchId = false,
  pageSize = 10,
}: UseRequestsProps) => {
  const { filters, ...filterActions } = useRequestFilters(initialStatusFilters);
  const { cursor, currentPage, cursors, handlePageChange, resetPagination } =
    useCursorPagination();

  const queryKey = useMemo(
    () => ['requests', { tenantType, tenantId, cursor, ...filters, pageSize }],
    [tenantType, tenantId, cursor, filters, pageSize],
  );

  const totalCountRef = useRef<number | undefined>(undefined);

  const { data, isPending, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getRequests(tenantType, tenantId, {
        cursor,
        limit: pageSize,
        dateFrom: filters.dateRange.from,
        dateTo: filters.dateRange.to,
        status: filters.selectedRequestStatus,
        requestType: filters.selectedRequestType,
        searchId: filters.searchId,
        ...(filters.selectedTenant && {
          [tenantType === 'proxy' ? 'providerTenantId' : 'proxyTenantId']:
            filters.selectedTenant,
        }),
      });

      if (result.totalCount !== totalCountRef.current) {
        totalCountRef.current = result.totalCount;
      }

      return result;
    },
    enabled: !!tenantType && !!tenantId,
  });

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [filters, resetPagination]);

  // Memoize the stable total count
  const stableTotalCount = useMemo(() => {
    // If data.totalCount is undefined, keep the previous value
    if (data?.totalCount === undefined) {
      return totalCountRef.current;
    }
    // Update ref and return new value if it's different
    if (data.totalCount !== totalCountRef.current) {
      totalCountRef.current = data.totalCount;
    }
    return totalCountRef.current;
  }, [data?.totalCount]);

  return useMemo(
    () => ({
      requests: data?.items ?? [],
      isLoading: isPending,
      error,
      refetch,
      pagination: {
        currentPage,
        nextCursor: data?.nextCursor,
        totalCount: stableTotalCount,
        cursors,
        handlePageChange,
      },
      filters: {
        ...filters,
        ...filterActions,
        tenantType,
        showStatusFilter,
        showSearchId,
      },
    }),
    [
      data,
      isPending,
      error,
      refetch,
      currentPage,
      stableTotalCount,
      cursors,
      handlePageChange,
      filters,
      filterActions,
    ],
  );
};
