import { FC } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo/Logo';

const Footer: FC<{ bgClassName?: string }> = ({
  bgClassName = 'bg-gray-900',
}) => {
  const navConfig = {
    features: {
      title: 'Features',
      href: '/#features',
    },
    pricing: {
      title: 'Pricing',
      href: '/#pricing',
    },
    faq: {
      title: 'FAQ',
      href: '/#faq',
    },
    contact: {
      title: 'Contact Us',
      href: '/contact',
    },
  };

  return (
    <footer
      className={`${bgClassName} text-white py-8 mt-auto relative min-h-10`}
    >
      <div className="py-4 px-6 rounded-full bg-white w-fit absolute top-[-20px] left-1/2 -translate-x-1/2 border border-gray-200">
        <Logo width={123} />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center text-center">
        <nav className="flex flex-col gap-8">
          <div className="flex items-center gap-8">
            {Object.entries(navConfig).map(([key, value]) => (
              <Link href={value.href} key={key}>
                <div className="text-sm">{value.title}</div>
              </Link>
            ))}
          </div>
          <p className="text-sm">© 2024 ProxyLink, Inc.</p>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
