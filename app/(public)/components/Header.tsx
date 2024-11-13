'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';

import { getArticles } from '@/lib/api/article';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/ui/spinner';
import Image from 'next/image';
import Logo from '@/components/Logo/Logo';

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
    select: data => data.filter(article => article.slug !== 'privacy-policy'),
  });

  const navConfig = {
    features: {
      title: 'Features',
      href: '#features',
    },
    pricing: {
      title: 'Pricing',
      href: '#pricing',
    },
    faq: {
      title: 'FAQ',
      href: '#faq',
    },
  };

  return (
    <header className="bg-white z-10 shadow-header sticky top-4 md:top-8 w-[calc(100%-2rem)] md:w-fit rounded-full mx-auto">
      <nav className="flex items-center px-6 py-4 justify-between">
        <Logo width={123} />
        <div className="hidden md:flex items-center gap-8 mr-11">
          {Object.entries(navConfig).map(([key, value]) => (
            <Link href={value.href} key={key}>
              <div className="text-sm text-gray-900">{value.title}</div>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button outline={true}>Sign in</Button>
          </Link>
          <Link href="/schedule-demo">
            <Button color="primary">Request Demo</Button>
          </Link>
        </div>

        <Button plain className="!p-0 md:hidden">
          <Image
            src="/images/mobile-menu.svg"
            width={24}
            height={24}
            alt="Menu"
          />
        </Button>
      </nav>
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <nav
          className="flex flex-col items-end w-full pr-2 pt-4"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {isLoading ? (
            <Spinner className="w-24 h-24 text-gray-500" />
          ) : (
            <>
              {data?.map(article => (
                <Link href={`/article/${article.slug}`} key={article.slug}>
                  <div className="py-4 text-lg">{article.title}</div>
                </Link>
              ))}
            </>
          )}
          <div className="flex items-center gap-2 mt-4">
            <Link href="/schedule-demo">
              <Button color="blue">Request Demo</Button>
            </Link>
            <Link href="/login">
              <Button outline={true}>Login</Button>
            </Link>
          </div>
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
