import Image from 'next/image';
import LandingHero from './landing-page/Hero';
import Features from './landing-page/Features';
import React from 'react';

const LandingPageContent = () => {
  return (
    <div className="relative w-full pb-[100vh]">
      <div className="absolute inset-0 w-full h-screen z-[-1] pointer-events-none">
        <Image
          src="/images/main-bg-start.svg"
          alt="Background"
          fill
          className="object-contain w-full"
          priority
        />
      </div>

      <img
        src="/images/main-blue-stripe.png?v=2"
        className="object-contain w-full"
        style={{
          top: '450px',
        }}
        alt="blue stripe divider"
      />

      <div className="relative z-[1]">
        <LandingHero />
        <Features />
      </div>
    </div>
  );
};

export default LandingPageContent;
