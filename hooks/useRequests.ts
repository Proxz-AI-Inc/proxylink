import { useState, useEffect } from 'react';
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

  // Reset cursor when filters change
  useEffect(() => {
    setCursor(null);
  }, [
    dateRange,
    selectedTenant,
    selectedRequestStatus,
    selectedRequestType,
    statusFilters,
    searchId,
  ]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'requests',
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
    ],
    queryFn: () =>
      getRequests(tenantType, tenantId, {
        cursor,
        limit: pageSize,
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
        status: selectedRequestStatus,
        requestType: selectedRequestType,
        searchId,
        // Add tenant filter if selected
        ...(selectedTenant && {
          [tenantType === 'proxy' ? 'providerTenantId' : 'proxyTenantId']:
            selectedTenant,
        }),
      }),
    enabled: !!tenantType && !!tenantId,
  });

  const handlePageChange = (newCursor: string | null | undefined) => {
    if (newCursor) {
      setCursor(newCursor);
    }
  };

  return {
    requests: data?.items ?? [],
    isLoading,
    error,
    refetch,
    pagination: {
      cursor,
      nextCursor: data?.nextCursor,
      totalCount: data?.totalCount ?? 0,
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
  };
};
