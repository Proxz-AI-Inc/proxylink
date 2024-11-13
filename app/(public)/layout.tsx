import { Poppins } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import { Metadata } from 'next';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Streamline Third-Party Customer Support',
  description:
    "ProxyLink allows you to quickly and securely resolve customer support requests submitted by third-parties ('Proxies') on behalf of your customers.",
  openGraph: {
    title: 'Streamline Third-Party Customer Support',
    description:
      "ProxyLink allows you to quickly and securely resolve customer support requests submitted by third-parties ('Proxies') on behalf of your customers.",
    images: [
      {
        url: 'https://proxylink.co/images/ProxyLink_banner.png', // Replace with your actual domain
        width: 1200,
        height: 630,
        alt: 'ProxyLink Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamline Third-Party Customer Support',
    description:
      "ProxyLink allows you to quickly and securely resolve customer support requests submitted by third-parties ('Proxies') on behalf of your customers.",
    images: ['https://proxylink.co/images/ProxyLink_banner.png'], // Replace with your actual domain
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${poppins.className} min-h-screen flex flex-col bg-[#4247700F]`}
    >
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
