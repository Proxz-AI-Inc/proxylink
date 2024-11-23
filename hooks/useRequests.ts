import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RequestStatus, TenantType, RequestType } from '@/lib/db/schema';
import { getRequests } from '@/lib/api/request';
import { DateRangePickerValue } from '@tremor/react';

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
  const [cursor, setCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: undefined,
    to: undefined,
  });
  const [selectedTenant, setSelectedTenant] = useState<string | undefined>();
  const [selectedRequestStatus, setSelectedRequestStatus] = useState<
    RequestStatus | undefined
  >();
  const [selectedRequestType, setSelectedRequestType] = useState<
    RequestType | undefined
  >();
  const [statusFilters, setStatusFilters] = useState<
    RequestStatus[] | undefined
  >(initialStatusFilters);
  const [searchId, setSearchId] = useState<string>('');

  // Create a string representation of current query params
  const queryParams = JSON.stringify({
    tenantType,
    tenantId,
    dateRange,
    selectedTenant,
    selectedRequestStatus,
    selectedRequestType,
    statusFilters,
    searchId,
  });

  // Reset cursor and totalCount when query params change
  useEffect(() => {
    setCursor(null);
    setTotalCount(undefined);
  }, [queryParams]);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: [
      'requests',
      {
        tenantType,
        tenantId,
        cursor,
        dateRange,
        selectedTenant,
        selectedRequestStatus,
        selectedRequestType,
        statusFilters,
        searchId,
        pageSize,
      },
    ],
    queryFn: async () => {
      const result = await getRequests(tenantType, tenantId, {
        cursor,
        limit: pageSize,
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
        status: selectedRequestStatus,
        requestType: selectedRequestType,
        searchId,
        ...(selectedTenant && {
          [tenantType === 'proxy' ? 'providerTenantId' : 'proxyTenantId']:
            selectedTenant,
        }),
      });

      // Set totalCount when we get a response with new query params
      if (result.totalCount !== undefined) {
        setTotalCount(result.totalCount);
      }

      return result;
    },
    enabled: !!tenantType && !!tenantId,
    staleTime: 30000,
  });

  const handlePageChange = (newCursor: string | null | undefined) => {
    if (newCursor) {
      setCursor(newCursor);
    }
  };

  return useMemo(
    () => ({
      requests: data?.items ?? [],
      isLoading: isPending,
      error,
      refetch,
      pagination: {
        cursor,
        nextCursor: data?.nextCursor,
        totalCount,
        handlePageChange,
      },
      filters: {
        dateRange,
        setDateRange,
        selectedTenant,
        setSelectedTenant,
        selectedRequestType,
        setSelectedRequestType,
        selectedRequestStatus,
        setSelectedRequestStatus,
        statusFilters,
        setStatusFilters,
        searchId,
        setSearchId,
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
      cursor,
      dateRange,
      selectedTenant,
      selectedRequestType,
      selectedRequestStatus,
      statusFilters,
      searchId,
      tenantType,
      showStatusFilter,
      showSearchId,
      totalCount,
    ],
  );
};
