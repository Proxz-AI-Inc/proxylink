// app/(public)/article/[slug]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import ArticleContent from '@/app/(public)/components/ArticleContent';
import { getArticle } from '@/lib/api/article';

const PRIVACY_POLICY_SLUG = 'privacy-policy';

export default async function PrivacyPolicyPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['privacy-policy'],
    queryFn: () => getArticle(PRIVACY_POLICY_SLUG),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleContent slug={PRIVACY_POLICY_SLUG} showCategory={false} />
    </HydrationBoundary>
  );
}
