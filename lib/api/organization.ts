import { TenantType, CustomerInfoField, RequestType } from '../db/schema';
import { DeleteResponse } from '@/components/OrganizationsList/organization.types';

export type Organization = {
  id: string; // Unique identifier for the tenant
  name: string; // Name of the tenant organization
  active: boolean;
  type: TenantType; // Type of the tenant (proxy or provider)
  userCount: number; // Number of users associated with this tenant
  requestCount: number; // Number of requests associated with this tenant
  connectedTenants: {
    // List of tenants connected to this tenant
    id: string; // ID of the connected tenant
    name: string; // Name of the connected tenant
  }[];
  adminEmails: string[];
  requiredCustomerInfo?: CustomerInfoField[];
};

export const getOrganisations = async (): Promise<Organization[]> => {
  const response = await fetch('/api/organizations');
  if (!response.ok) {
    throw new Error('Failed to fetch organization stats');
  }
  return response.json();
};

export const createOrganization = async ({
  name,
  adminEmails,
  orgType,
  authFields,
  requestTypes,
}: {
  name: string;
  adminEmails: string[];
  orgType: 'proxy' | 'provider';
  authFields: string[];
  requestTypes: RequestType[];
}): Promise<{
  message: string;
}> => {
  const response = await fetch('/api/organizations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orgName: name,
      adminEmails,
      orgType,
      authFields,
      requestTypes,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create organization');
  }

  return response.json();
};

export const deleteOrganization = async (
  id: string,
): Promise<DeleteResponse> => {
  const response = await fetch(`/api/organizations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
};
