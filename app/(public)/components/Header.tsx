'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { useAuth } from '@/hooks/useAuth';
import Profile from '@/components/Profile/Profile';
import { getArticles } from '@/lib/api/article';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/ui/spinner';
import { getUrlForSuccessfullLogin } from '@/components/Login/login.utils';

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userData } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
    select: data => data.filter(article => article.slug !== 'privacy-policy'),
  });

  return (
    <header className="bg-white md:border-b-4 border-blue-700 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-8 md:py-4">
          <Link href="/">
            <img
              src="/images/Logo.svg"
              className="w-60 md:mt-6 ml-4 md:mb-4 md:ml-0"
              alt="ProxyLink logotype"
            />
          </Link>

          <nav className="hidden md:flex md:w-full md:justify-around md:items-center md:pl-[50%]">
            {!userData && (
              <>
                <Link
                  href="/pricing"
                  className="text-lg font-bold text-blue-800"
                >
                  Pricing
                </Link>

                <div>
                  <Link href="/schedule-demo">
                    <Button color="blue" className="mx-2">
                      Request Demo
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button outline={true} className="mx-2">
                      Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
            {userData && (
              <div className="flex items-center gap-2">
                <Profile popupAlign="bottom" />
                <Link href={getUrlForSuccessfullLogin(userData.tenantType)}>
                  <Button outline={true} className="mx-2">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </nav>
          <button
            className="md:hidden text-4xl mr-4 ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
              <Link
                href="/pricing"
                className="text-lg font-bold text-blue-800 mb-2"
              >
                Pricing
              </Link>
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
