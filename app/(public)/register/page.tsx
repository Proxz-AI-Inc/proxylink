import { Metadata } from 'next';
import MarketplaceLandingPage from '../components/MarketplaceLandingPage';

export const metadata: Metadata = {
  title: 'ProxyLink | Marketplace',
};

export default function MarketplacePage() {
  return <MarketplaceLandingPage />;
}
