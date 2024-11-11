import { Metadata } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import OrganizationsList from '@/components/OrganizationsList/OrganizationsList';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { getOrganisations } from '@/lib/api/organization';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ProxyLink | Organisations',
};

export default async function OrganisationsPage() {
  await initializeFirebaseAdmin();

  const sessionCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const decodedClaim = await getAuth().verifySessionCookie(sessionCookie);

    // Extract tenantType from the decoded token
    const { tenantType } = decodedClaim;

    if (tenantType !== 'management') {
      redirect('/actions');
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ['organizations'],
      queryFn: getOrganisations,
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrganizationsList />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error('Error verifying session or fetching data:', error);
    redirect('/login');
  }
}
