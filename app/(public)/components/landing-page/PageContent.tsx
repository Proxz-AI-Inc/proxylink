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
    <div className="overflow-hidden pt-12">
      <LandingHero />
      <div className="w-full relative overflow-hidden mb-16 md:mb-0">
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
        <div className="w-full relative overflow-hidden -mt-12 sm:-mt-32 md:-mt-40 xl:-mt-48 2xl:-mt-60">
          <img
            src="/images/main-blue-stripe.png"
            alt="Background"
            className="w-full object-cover md:min-w-[1200px] relative left-1/2 -translate-x-1/2"
          />
        </div>
        <div className="relative sm:-mt-40 md:-mt-64 lg:-mt-80">
          <CallToAction />
        </div>
      </div>
    </div>
  );
};

export default LandingPageContent;
