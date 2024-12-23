import { Metadata } from 'next';
import RegisterLandingPage from '../components/register/RegisterLandingPage';

export const metadata: Metadata = {
  title: 'ProxyLink | Register Your Brand',
  description:
    'Register your brand with ProxyLink to get access to our AI-powered proxy service.',
  openGraph: {
    title: 'Register Your Brand on Proxylink',
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
    title: 'Register Your Brand on Proxylink',
    description:
      'Enable Consumer AI Assistants to Provide Magical Customer Experiences With Your Brand',
    images: ['https://proxylink.co/images/ProxyLink-open-graph.png'],
  },
};

export default function RegisterPage() {
  return <RegisterLandingPage />;
}
