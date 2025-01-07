// app/(public)/article/[slug]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import ArticleContent from '@/app/(public)/components/ArticleContent';
import { getArticle } from '@/lib/api/article';
import { TERMS_OF_SERVICE_SLUG } from '@/constants/app.contants';

export default async function TermsOfServicePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['terms-of-service'],
    queryFn: () => getArticle(TERMS_OF_SERVICE_SLUG),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:max-w-[1080px] mx-auto p-6 py-24 md:pt-16 md:pb-0 gap-8 md:gap-12 min-h-[100dvh] md:min-h-screen">
        <ArticleContent slug={TERMS_OF_SERVICE_SLUG} showCategory={false} />
      </div>
    </HydrationBoundary>
  );
}
