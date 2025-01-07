import { parseErrorMessage } from '@/utils/general';
import { TenantType, User, Invitation } from '@/lib/db/schema';

/**
 * Sends a PATCH request to update the user's info.
 * @param {string} id - The user ID.
 * @param {string} name - The updated name.
 * @returns {Promise<User | Error>} A promise indicating the success or failure of the update.
 * @throws {Error} If the request fails.
 */
export const updateUser = async ({
  id,
  firstName,
  lastName,
  role,
}: {
  id: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
}): Promise<{ message: string } | Error> => {
  const response = await fetch('/api/users/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName,
      lastName,
      role,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(parseErrorMessage(error));
    throw new Error('Failed to update user');
  }

  return response.json();
};

export const fetchUsers = async ({
  tenantId,
}: {
  tenantId: string | undefined;
}): Promise<User[] | Error> => {
  if (!tenantId) {
    return new Error('Tenant ID is required');
  }

  try {
    const response = await fetch('/api/users?tenantId=' + tenantId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get users');
    }

    const users = await response.json();
    return users;
  } catch (error) {
    return new Error(parseErrorMessage(error));
  }
};

export const inviteUser = async ({
  tenantId,
  sendTo,
  invitedBy,
  tenantType,
  tenantName,
  isAdmin = false,
  isResend = false,
}: {
  sendTo: string;
  invitedBy: string;
  tenantType: TenantType;
  tenantName: string;
  tenantId: string;
  isAdmin?: boolean;
  isResend?: boolean;
}): Promise<Invitation> => {
  try {
    const response = await fetch('/api/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isAdmin,
        invitedBy,
        tenantType,
        tenantName,
        tenantId,
        sendTo,
        isResend,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to invite user');
    }

    return response.json() as Promise<Invitation>;
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

export const getInvitations = async (
  tenantId: string,
): Promise<Invitation[] | Error> => {
  try {
    const response = await fetch(`/api/invitations?tenantId=${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get invitations');
    }

    const invitations: Invitation[] = await response.json();
    return invitations;
  } catch (error) {
    return new Error(parseErrorMessage(error));
  }
};

export const updateUserData = async ({
  userId,
  data,
}: {
  userId?: string;
  data: Partial<User>;
}): Promise<User | { message: string } | Error> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user data');
    }

    return response.json();
  } catch (error) {
    console.error(parseErrorMessage(error));
    throw new Error('Failed to update user data');
  }
};

/**
 * Checks if a user exists in Firebase by email
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} True if user exists, false otherwise
 */
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `/api/users/exists?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to check user existence');
    }

    const { exists } = await response.json();
    return exists;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw new Error(parseErrorMessage(error));
  }
};

export const deleteInvitation = async (
  invitationId: string,
): Promise<{ message: string } | Error> => {
  try {
    const response = await fetch(`/api/invitations/${invitationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete invitation');
    }

    return response.json();
  } catch (error) {
    console.error('Error deleting invitation:', error);
    throw new Error(parseErrorMessage(error));
  }
};
