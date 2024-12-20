'use client';
import Spinner from '@/components/ui/spinner';
import { getArticles } from '@/lib/api/article';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FC } from 'react';

const Articles: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
    select: data =>
      data.filter(article => {
        return (
          article.slug !== 'privacy-policy' &&
          article.slug !== 'terms-and-conditions'
        );
      }),
  });

  return (
    <section className="px-4 py-12 md:p-20">
      <h2 className="text-4xl font-bold mb-2">
        Resources for customer support leaders
      </h2>
      <p className="text-gray-500">
        Know what to do when a proxy contacts your support department.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mt-10">
        {isLoading ? (
          <Spinner className="w-24 h-24 text-gray-500" />
        ) : (
          <>
            {data?.map(article => (
              <div
                key={article.slug}
                className="basis-1/3 min-h-80 h-full flex flex-col gap-2 shadow-xl rounded-xl py-10 px-6 bg-white hover:shadow-2xl"
              >
                <h3 className="text-3xl mb-2">{article.title}</h3>
                <p className="text-lg text-gray-600 flex-1">{article.teaser}</p>
                <Link
                  href={`/article/${article.slug}`}
                  className="justify-self-end"
                >
                  <Button color="primary" className="w-full">
                    Explore
                  </Button>
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Articles;
