'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';

import Image from 'next/image';
import Logo from '@/components/Logo/Logo';

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="bg-white z-20 shadow-header sticky top-4 md:top-8 w-[calc(100%-2rem)] md:w-fit rounded-full mx-auto">
      <nav className="flex items-center px-6 py-4 justify-between">
        <Logo width={123} className="mr-11" />
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

        <Button
          plain
          className="!p-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
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
        className="h-fit"
        width="w-full"
        minWidth="min-w-full"
      >
        <nav
          className="flex flex-col pr-2 py-4"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col gap-2">
            {Object.entries(navConfig).map(([key, value]) => (
              <Link href={value.href} key={key}>
                <div className="text-sm font-medium text-gray-900 w-full p-2">
                  {value.title}
                </div>
                <hr className="border-gray-200 w-full py-1" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-8 w-full">
            <Link href="/login" className="basis-1/2 w-full">
              <Button outline={true} className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/schedule-demo" className="basis-1/2 w-full">
              <Button color="primary" className="w-full">
                Book a Demo
              </Button>
            </Link>
          </div>
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
