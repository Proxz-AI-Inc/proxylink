import { User } from '@sentry/nextjs';
import { initializeFirebaseAdmin } from './admin';
import { getFirestore } from 'firebase-admin/firestore';

export const getProxyTenantNameById = async (
  id: string,
): Promise<string | null> => {
  try {
    initializeFirebaseAdmin();
    const db = getFirestore();
    const tenantDoc = await db.collection('tenants').doc(id).get();

    if (!tenantDoc.exists) {
      throw new Error(`Tenant with ID ${id} not found`);
    }

    const tenantData = tenantDoc.data();
    if (!tenantData || !tenantData.name) {
      throw new Error(`Tenant data is missing or does not contain a name`);
    }

    return tenantData.name;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getProviderEmails = async (
  providerTenantId: string,
): Promise<string[]> => {
  try {
    initializeFirebaseAdmin();
    const db = getFirestore();
    const usersSnapshot = await db
      .collection('users')
      .where('tenantId', '==', providerTenantId)
      .get();

    if (usersSnapshot.empty) {
      return [];
    }

    return usersSnapshot.docs
      .filter((user: User) => {
        if (!user.notifications) return false;
        return user.notifications?.newRequests;
      })
      .map(doc => {
        const userData = doc.data();
        return userData.email;
      })
      .filter(Boolean);
  } catch (err) {
    console.error('Error fetching provider emails:', err);
    return [];
  }
};