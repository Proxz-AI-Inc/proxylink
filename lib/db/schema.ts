// file: lib/db/schema.ts
import authFields from '@/constants/authFields.json';
export type CancellationStatus =
  | 'Pending'
  | 'Canceled'
  | 'Declined'
  | 'Save Offered'
  | 'Save Declined'
  | 'Save Accepted'
  | 'Save Confirmed';

export type DiscountStatus =
  | 'Pending'
  | 'Declined'
  | 'Applied'
  | 'Not Qualified';

export type CustomerInfoField = (typeof authFields)[number]['field'];

export type CustomerInfo = { [K in CustomerInfoField]?: string };

export type DeclineReason = {
  field: string;
  value: string;
};

export type RequestType = 'Cancellation' | 'Discount';
export type RequestStatus = CancellationStatus | DiscountStatus;

export interface Request {
  id: string;
  version: number;
  status: RequestStatus;
  submittedBy: string;
  requestType: RequestType;
  dateSubmitted: string;
  dateResponded: string | null;
  proxyTenantId: string;
  providerTenantId: string;
  customerInfo: CustomerInfo;
  saveOffer: RequestSaveOffer | null;
  declineReason: DeclineReason[] | null;
  notes: string | null;
  logId: string;
}

export type RequestAvgResponseTime = {
  provider: {
    ms: number;
    hours: number;
  };
  proxy: {
    ms: number;
    hours: number;
  };
};
export interface RequestLog {
  requestId: string;
  changes: RequestChange[];
  avgResponseTime: RequestAvgResponseTime;
}

export interface RequestWithLog extends Request {
  log: RequestLog;
}

export interface RequestChange {
  field: string;
  oldValue: string | number | boolean | null | DeclineReason[];
  newValue: string | number | boolean | null | DeclineReason[];
  changedBy: {
    email: string;
    tenantType: TenantType;
    tenantId: string;
  };
  updatedAt: number;
}

export type TenantType = 'proxy' | 'provider' | 'management';

export interface User {
  id: string;
  version: number;
  email: string;
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  role: 'admin' | 'user';
  createdAt: string;
  firstName: string;
  lastName: string;
}

export type SaveOffer = {
  id: string;
  dateCreated: string;
  dateUpdated: string | null;
  title: string;
  description: string;
};

export type RequestSaveOffer = SaveOffer & {
  dateOffered: string | null;
  dateAccepted?: string | null;
  dateDeclined?: string | null;
  dateConfirmed?: string | null;
};

export interface Tenant {
  id: string;
  version: number;
  name: string;
  type: TenantType;
  createdAt: string;
  active: boolean;
  requiredCustomerInfo?: CustomerInfoField[]; // Only for provider tenants
  requestTypes?: RequestType[];
  saveOffers?: SaveOffer[];
  admins: string[];
  credits: number;
}

export const CURRENT_SCHEMA_VERSION = 3;

export const collections = {
  requests: 'requests',
  invitations: 'invitations',
  users: 'users',
  tenants: 'tenants',
  requestsLog: 'requestsLog',
};

// Add this new type
export interface Invitation {
  id: string;
  email: string;
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  isAdmin: boolean;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
}
