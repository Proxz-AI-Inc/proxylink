import { Metadata } from 'next';
import Login from '@/components/Login/Login';
import { decodeToken } from '@/lib/jwt/utils';
import { getAuth } from 'firebase-admin/auth';
import { v4 as uuidv4 } from 'uuid';
import { parseErrorMessage } from '@/utils/general';
import { collections, CURRENT_SCHEMA_VERSION, User } from '@/lib/db/schema';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';

export const metadata: Metadata = {
  title: 'ProxyLink | Sign Up',
};

export type SignUpResponse = {
  user: User | null;
  error?: string;
};

type SearchParams = Promise<{ token: string | undefined }>;

export default async function SignUpPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;
  if (!token) {
    console.error('No token provided');
    return null;
  }

  const newUserData = decodeToken(token);

  // Server Action to handle sign-up
  const handleSignUp = async (formData: FormData): Promise<SignUpResponse> => {
    'use server';
    if (!newUserData || newUserData === 'expired') {
      return { user: null, error: 'Invalid or expired invitation' };
    }
    try {
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const password = formData.get('password') as string;

      const app = initializeFirebaseAdmin();
      const auth = getAuth();
      const db = getFirestore(app);

      const newUser: User = {
        id: uuidv4(),
        email: newUserData.email,
        firstName,
        lastName,
        tenantId: newUserData.tenantId,
        tenantType: newUserData.tenantType,
        tenantName: newUserData.tenantName,
        role: newUserData.isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        version: CURRENT_SCHEMA_VERSION,
        notifications: {
          actionNeededUpdates: true,
          organizationStatusUpdates: false,
        },
      };

      const userRecord = await auth.createUser({
        uid: newUser.id,
        email: newUser.email,
        password,
      });

      // Set custom user claims
      await auth.setCustomUserClaims(userRecord.uid, {
        tenantId: newUserData.tenantId,
        tenantType: newUserData.tenantType,
        tenantName: newUserData.tenantName,
        role: newUser.role,
      });

      // Create user document in Firestore
      await db.collection(collections.users).doc(newUser.id).set(newUser);

      // Delete the invitation document
      const invitationSnapshot = await db
        .collection(collections.invitations)
        .where('email', '==', newUserData.email)
        .where('tenantId', '==', newUserData.tenantId)
        .get();

      if (!invitationSnapshot.empty) {
        const invitationDoc = invitationSnapshot.docs[0];
        await invitationDoc.ref.delete();
      }

      return { user: newUser };
    } catch (error) {
      console.error(parseErrorMessage(error));
      return {
        user: null,
        error: parseErrorMessage(error),
      };
    }
  };

  return (
    <Login
      type="sign-up"
      newUserData={newUserData}
      handleSignUp={handleSignUp}
    />
  );
}
