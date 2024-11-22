import dotenv from 'dotenv';
dotenv.config();
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { collections, User } from '@/lib/db/schema';

export async function updateUserNotifications() {
  initializeFirebaseAdmin();
  const db = getFirestore();

  const usersRef = db.collection(collections.users);
  const snapshot = await usersRef.get();

  const batch = db.batch();

  snapshot.forEach(doc => {
    const userData = doc.data() as User;
    if (
      !userData.notifications ||
      userData.notifications.actionNeededUpdates === undefined
    ) {
      batch.update(doc.ref, {
        'notifications.actionNeededUpdates': true,
      });
    }
  });

  await batch.commit();
  console.log('User notifications updated successfully');
}

updateUserNotifications();
