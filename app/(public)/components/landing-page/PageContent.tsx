import LandingHero from './Hero';
import Features from './Features';
import Integrations from './Integrations';
import ApiForProxies from './ApiForProxies';
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
      <img
        src="/images/main-blue-stripe.png"
        alt="Background"
        className="object-contain w-full z-[1] top-[630px] absolute"
      />
      <Features />
      <Integrations />
      <ApiForProxies />
    </>
  );
};

export default LandingPageContent;
