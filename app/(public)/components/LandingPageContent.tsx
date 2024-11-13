import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import LandingHero from './landing-page/Hero';

const LandingPageContent = () => {
  return (
    <main className="flex-grow relative">
      <div className="absolute inset-0 w-full h-full z-[-1]">
        <Image
          src="/images/main-bg-start.svg"
          alt="Background"
          fill
          className="object-contain w-full"
          priority
        />
      </div>
      <LandingHero />
      <Image
        src="/images/main-blue-stripe.png"
        alt="Background"
        fill
        className="object-contain w-full z-[-1] top-[450px]"
        priority
      />
      <Features />
    </main>
  );
};

export default LandingPageContent;
