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
      <div className="flex flex-col md:max-w-[1080px] mx-auto p-6 py-24 md:pt-16 md:pb-0 gap-8 md:gap-12 min-h-[100dvh] md:min-h-screen">
        <CareersContent slug={params.slug} />
      </div>
    </HydrationBoundary>
  );
}
