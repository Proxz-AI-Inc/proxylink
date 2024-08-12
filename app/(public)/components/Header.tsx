'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white md:border-b-8 border-blue-700 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-8 md:py-4">
          <img
            src="/images/Logo.svg"
            className="w-60 md:mt-6 ml-4 md:mb-4 md:ml-0"
            alt="ProxyLink logotype"
          />

          <nav className="hidden md:block">
            <Link href="#">
              <Button color="blue" className="mx-2">
                Request Demo
              </Button>
            </Link>
            <Link href="/login">
              <Button outline={true} className="mx-2">
                Login
              </Button>
            </Link>
          </nav>
          <button
            className="md:hidden text-4xl mr-4"
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
        <nav className="flex flex-col items-end w-full">
          <Link href="#" className="py-4 text-lg">
            What are Proxies?
          </Link>
          <Link href="#" className="py-4 text-lg">
            Your Rights
          </Link>
          <Link href="#" className="py-4 text-lg">
            FTC Mandates
          </Link>
          <div className="flex items-center gap-2 mt-4">
            <Link href="#">
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