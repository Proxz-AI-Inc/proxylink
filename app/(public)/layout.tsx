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
  title: 'Master Third Party Customer Experience',
  description:
    'Consumers are delegating customer support tasks to third parties (a.k.a. "proxies"). ProxyLink helps you securely and efficiently resolve their requests.',
  openGraph: {
    title: 'Master Third Party Customer Experience',
    description:
      'Consumers are delegating customer support tasks to third parties (a.k.a. "proxies"). ProxyLink helps you securely and efficiently resolve their requests.',
    images: [
      {
        url: 'https://proxylink.co/images/ProxyLink-open-graph.png', // Replace with your actual domain
        width: 1200,
        height: 630,
        alt: 'ProxyLink Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Third Party Customer Experience',
    description:
      'Consumers are delegating customer support tasks to third parties (a.k.a. "proxies"). ProxyLink helps you securely and efficiently resolve their requests.',
    images: ['https://proxylink.co/images/ProxyLink-open-graph.png'],
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${poppins.className} flex flex-col min-h-screen bg-landing z-0`}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
