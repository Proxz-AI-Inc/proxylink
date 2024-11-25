import { RequestStatus, RequestType } from '@/lib/db/schema';
import { DateRangePickerValue } from '@tremor/react';
import { useState, useMemo, useCallback } from 'react';

export const useRequestFilters = (initialStatusFilters?: RequestStatus[]) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
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
  const [searchId, setSearchId] = useState('');

  const setDateRange = useCallback((range: DateRangePickerValue) => {
    setDateFrom(range.from);
    setDateTo(range.to);
  }, []);

  const filters = useMemo(
    () => ({
      dateRange: { from: dateFrom, to: dateTo },
      selectedTenant,
      selectedRequestStatus,
      selectedRequestType,
      statusFilters,
      searchId,
    }),
    [
      dateFrom,
      dateTo,
      selectedTenant,
      selectedRequestStatus,
      selectedRequestType,
      statusFilters,
      searchId,
    ],
  );

  const reset = useCallback(() => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedTenant(undefined);
    setSelectedRequestStatus(undefined);
    setSelectedRequestType(undefined);
    setStatusFilters(initialStatusFilters);
    setSearchId('');
  }, [initialStatusFilters]);

  return {
    filters,
    setDateRange,
    setSelectedTenant,
    setSelectedRequestStatus,
    setSelectedRequestType,
    setStatusFilters,
    setSearchId,
    reset,
  };
};
