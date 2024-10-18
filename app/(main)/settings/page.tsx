import { Metadata } from 'next';
import Settings from '@/components/Settings/Settings';
import { getTenant } from '@/lib/api/tenant';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { Loader } from '@/components/ui/spinner';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'ProxyLink | Settings',
};

export default async function SettingsPage({
  searchParams: { firebase_session },
}: {
  searchParams: {
    firebase_session?: string;
  };
}) {
  await initializeFirebaseAdmin();

  let sessionCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  console.log('SettingsPage sessionCookie', sessionCookie);
  console.log('SettingsPage firebaseSession', firebase_session);

  if (firebase_session && typeof firebase_session === 'string') {
    sessionCookie = firebase_session;
    console.log('SettingsPage sessionCookie from URL', sessionCookie);
  }

  if (!sessionCookie) {
    return <div>Please log in to view this page.</div>;
  }

  try {
    const decodedClaim = await getAuth().verifySessionCookie(sessionCookie);

    // Extract tenantType and tenantId from the decoded token
    const { tenantType, tenantId } = decodedClaim;

    if (!tenantType || !tenantId) {
      throw new Error('Tenant information missing from token');
    }
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ['tenant', tenantId],
      queryFn: () => getTenant(tenantId),
      staleTime: 0,
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loader />}>
          <Settings tenantId={tenantId} />
        </Suspense>
      </HydrationBoundary>
    );
  } catch (error) {
    console.error('Error verifying session or fetching data:', error);
    return <div>An error occurred. Please try logging in again.</div>;
  }
}
