// file: app/(public)/careers/[slug]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import CareersContent from '../../components/CareersContent';
import { getJobPosting } from '@/lib/api/article';

export default async function JobPostingPage({
  params,
}: {
  params: { slug: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['careers', params.slug],
    queryFn: () => getJobPosting(params.slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CareersContent slug={params.slug} />
    </HydrationBoundary>
  );
}
