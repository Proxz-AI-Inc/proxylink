// app/(public)/article/[slug]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import ArticleContent from '@/app/(public)/components/ArticleContent';
import { getArticle } from '@/lib/api/article';

const TERMS_OF_SERVICE_SLUG = 'terms-and-conditions';

export default async function TermsOfServicePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['terms-of-service'],
    queryFn: () => getArticle(TERMS_OF_SERVICE_SLUG),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleContent slug={TERMS_OF_SERVICE_SLUG} showCategory={false} />
    </HydrationBoundary>
  );
}
