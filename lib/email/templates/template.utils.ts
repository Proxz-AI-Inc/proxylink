import { getFirestore } from 'firebase-admin/firestore';
import { User, Request } from '@/lib/db/schema';

/**
 * Gets eligible email recipients based on their notification preferences and context
 *
 * Notification Logic:
 * 1. For existing requests (when request parameter is provided):
 *    - If user is a participant in the request (listed in participants):
 *      -> Notify if actionNeededUpdates is enabled
 *    - If user is not a participant:
 *      -> Notify him if organizationStatusUpdates is enabled
 *
 * 2. For new requests upload (when request parameter is not provided):
 *    -> Sends if either actionNeededUpdates OR organizationStatusUpdates is enabled
 *    Note: New requests are considered as requiring action, but we also respect
 *    organizationStatusUpdates preference as it indicates user's interest in
 *    general organization updates, so if both are disabled, we don't send anything
 *
 * @param tenantId - The ID of the tenant to fetch users from
 * @param request - Optional request object for checking participant status
 * @returns Array of eligible recipient email addresses
 */
export const getEligibleRecipientsFromTenant = async (
  tenantId: string,
  request?: Request,
): Promise<string[]> => {
  const db = getFirestore();
  const usersRef = db.collection('users');
  const usersSnapshot = await usersRef.where('tenantId', '==', tenantId).get();

  return usersSnapshot.docs
    .map(doc => doc.data() as User)
    .filter(user => {
      if (request) {
        const isParticipant =
          request.participants?.provider?.emails.includes(user.email) ||
          request.participants?.proxy?.emails.includes(user.email);

        if (isParticipant) {
          return user.notifications?.actionNeededUpdates;
        }
      }

      return (
        user.notifications?.actionNeededUpdates ||
        user.notifications?.organizationStatusUpdates
      );
    })
    .map(user => user.email);
};
