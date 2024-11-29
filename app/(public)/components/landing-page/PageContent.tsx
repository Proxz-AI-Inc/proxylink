'use client';
import LandingHero from './Hero';
import Features from './Features';
import Integrations from './Integrations';
import ApiForProxies from './ApiForProxies';
import Pricing from './Pricing';
import FAQSection from './FAQSection';
import CallToAction from './CallToAction';
import Workflows from './Workflows';

const LandingPageContent = () => {
  return (
    <div className="overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-[1]">
        <img
          src="/images/main-bg-start.svg"
          alt="Background"
          className="hidden md:block object-contain w-full max-w-[1080px] mx-auto"
        />
      </div>
      <LandingHero />
      <div className="w-full relative overflow-hidden -mt-24 mb-16 md:mb-0">
        <img
          src="/images/main-blue-stripe.png"
          alt="Background"
          className="w-full object-cover md:min-w-[1200px] relative left-1/2 -translate-x-1/2"
        />
      </div>
      <Features />
      <Workflows />
      <Integrations />
      <ApiForProxies />
      <Pricing />
      <FAQSection />
      <div className="relative">
        <div className="w-full relative overflow-hidden -mt-24 sm:-mt-32 md:-mt-48 xl:-mt-64 2xl:-mt-80">
          <img
            src="/images/main-blue-stripe.png"
            alt="Background"
            className="w-full object-cover min-w-[1200px] relative left-1/2 -translate-x-1/2"
          />
        </div>
        <div className="relative -mt-32 sm:-mt-40 md:-mt-64 lg:-mt-80">
          <CallToAction />
        </div>
      </div>
    </div>
  );
};

export default LandingPageContent;
