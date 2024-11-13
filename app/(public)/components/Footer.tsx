import { FC } from 'react';
import Link from 'next/link';

const Footer: FC<{ bgClassName?: string }> = ({
  bgClassName = 'bg-[#424770]',
}) => {
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
    <footer className={`${bgClassName} text-white py-8 mt-auto relative`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <nav className="flex flex-col gap-4">
          <div className="flex items-center gap-8">
            {Object.entries(navConfig).map(([key, value]) => (
              <Link href={value.href} key={key}>
                <div className="text-sm">{value.title}</div>
              </Link>
            ))}
          </div>
          <div>© 2024 ProxyLink, Inc.</div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
