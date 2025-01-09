import { Metadata } from 'next';
import ApplyLandingPage from '../components/apply/ApplyLandingPage';

export const metadata: Metadata = {
  title: 'ProxyLink | Apply',
  openGraph: {
    title: 'Apply to ProxyLink',
    description:
      'Enable Consumer AI Assistants to Provide Magical Customer Experiences With Your Brand',
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
    title: 'Apply to ProxyLink',
    description:
      'Enable Consumer AI Assistants to Provide Magical Customer Experiences With Your Brand',
    images: ['https://proxylink.co/images/ProxyLink-open-graph.png'],
  },
};

export default function ApplyPage() {
  return <ApplyLandingPage />;
}
