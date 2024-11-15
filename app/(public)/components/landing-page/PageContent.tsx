'use client';
import LandingHero from './Hero';
import Features from './Features';
import Integrations from './Integrations';
import ApiForProxies from './ApiForProxies';
import Pricing from './Pricing';
import FAQSection from './FAQSection';
import CallToAction from './CallToAction';

const LandingPageContent = () => {
  return (
    <>
      <div className="absolute inset-0 w-full h-full z-[1]">
        <img
          src="/images/main-bg-start.svg"
          alt="Background"
          className="object-contain w-full max-w-[1080px] mx-auto"
        />
      </div>
      <LandingHero />
      <div className="w-full relative overflow-hidden">
        <img
          src="/images/main-blue-stripe.png"
          alt="Background"
          className="w-full object-cover 
            min-w-[1200px] 
            relative left-1/2 -translate-x-1/2"
        />
      </div>
      <Features />
      <Integrations />
      <ApiForProxies />
      <Pricing />
      <FAQSection />
      <CallToAction />
    </>
  );
};

export default LandingPageContent;
