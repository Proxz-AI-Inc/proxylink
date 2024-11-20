// file: app/api/request/route.ts
import {
  Request,
  RequestStatus,
  RequestType,
  RequestWithLog,
} from '@/lib/db/schema';

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  totalCount: number;
}

export const getRequest = async <T extends boolean = true>({
  id,
  tenantType,
  tenantId,
  includeLog = true as T,
}: {
  id?: string;
  tenantType: string | undefined;
  tenantId: string | undefined;
  includeLog?: T;
}): Promise<T extends true ? RequestWithLog : Request> => {
  if (!id) {
    throw new Error('Request ID is required');
  }
  const response = await fetch(
    `/api/request/${id}?tenantType=${tenantType}&tenantId=${tenantId}&includeLog=${includeLog}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch request');
  }

  const data = await response.json();
  return data as T extends true ? RequestWithLog : Request;
};

export interface RequestsQueryParams {
  tenantType: string | undefined;
  tenantId: string | undefined;
  includeLog?: boolean;
  limit?: number;
  cursor?: string | null;
  dateFrom?: Date;
  dateTo?: Date;
  status?: RequestStatus;
  requestType?: RequestType;
  searchId?: string;
}

export const getRequests = async <T extends boolean = true>(
  tenantType: string | undefined,
  tenantId: string | undefined,
  {
    includeLog = true as T,
    limit = 10,
    cursor = null,
    dateFrom,
    dateTo,
    status,
    requestType,
    searchId,
  }: Omit<RequestsQueryParams, 'tenantType' | 'tenantId'> = {},
): Promise<PaginatedResponse<T extends true ? RequestWithLog : Request>> => {
  if (!tenantType || !tenantId) {
    throw new Error('Tenant information missing from token');
  }

  try {
    const queryParams = new URLSearchParams({
      tenantType,
      tenantId,
      includeLog: String(includeLog),
      limit: String(limit),
    });

    if (cursor) queryParams.append('cursor', cursor);
    if (dateFrom) queryParams.append('dateFrom', dateFrom.toISOString());
    if (dateTo) queryParams.append('dateTo', dateTo.toISOString());
    if (status) queryParams.append('status', status);
    if (requestType) queryParams.append('requestType', requestType);
    if (searchId) queryParams.append('searchId', searchId);

    const response = await fetch(`/api/request?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch requests');
    }

    const data = await response.json();
    return data as PaginatedResponse<T extends true ? RequestWithLog : Request>;
  } catch (error) {
    throw new Error('Error getting requests: ' + (error as Error).message);
  }
};

interface PostRequestsResponse {
  ids: string[];
}

/**
 * Sends a POST request to create multiple new requests.
 * @param {Omit<Request, 'id'>[]} requests - An array of request objects without IDs.
 * @returns {Promise<string[]>} A promise that resolves to an array of created request IDs.
 * @throws {Error} If the request fails.
 */
export async function postRequests(
  requests: Omit<Request, 'id' | 'logId'>[],
): Promise<string[]> {
  const response = await fetch('/api/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit requests');
  }

  const data: PostRequestsResponse = await response.json();
  return data.ids;
}

/**
 * Sends a PATCH request to update a specific request.
 * @param {Request} request - The updated request object.
 * @returns {Promise<void>} A promise that resolves when the request is updated.
 * @throws {Error} If the request fails.
 */
export async function updateRequest(request: Request): Promise<void> {
  const response = await fetch(`/api/request/${request.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to update request');
  }
}

export function filterRequests(
  requests: Request[],
  statuses: RequestStatus[],
): Request[] {
  return requests.filter(request => statuses.includes(request.status));
}
