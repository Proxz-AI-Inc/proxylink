import Image from 'next/image';
import LandingHero from './Hero';
import Features from './Features';
const LandingPageContent = () => {
  return (
    <>
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
      <img
        src="/images/main-blue-stripe.png"
        alt="Background"
        className="object-contain w-full z-[-1] top-[630px] absolute"
      />
      <Features />
    </>
  );
};

export default LandingPageContent;
