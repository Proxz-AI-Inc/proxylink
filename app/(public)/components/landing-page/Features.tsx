import { useState, useEffect } from 'react';
import ProxyLinkSwitches from './ProxyLinkSwitches';
import SectionBadge from './SectionBadge';
import Image from 'next/image';

const Features = () => {
  const [switches, setSwitches] = useState({
    enable: false,
    saveOffers: false,
    automate: false,
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setIsSliding] = useState(false);

  const slides = [
    '/images/features-slide-1-without-proxylink.svg',
    '/images/features-slide-2-enabled.svg',
    '/images/features-slide-3-save-offers.svg',
    '/images/features-slide-4-automatic.svg',
  ];

  const getSlideIndex = () => {
    if (!switches.enable) return 0;
    if (!switches.saveOffers) return 1;
    if (!switches.automate) return 2;
    return 3;
  };

  useEffect(() => {
    const newIndex = getSlideIndex();
    if (newIndex !== currentSlide) {
      setIsSliding(true);
      setCurrentSlide(newIndex);
      const timer = setTimeout(() => setIsSliding(false), 300); // Match duration-300
      return () => clearTimeout(timer);
    }
  }, [switches, currentSlide]);

  return (
    <section className="relative">
      <div className="absolute inset-0 w-full h-full z-1 top-[-200px]">
        <img
          src="/images/main-bg-start.svg"
          alt="Background"
          className="object-contain w-full max-w-[1080px] mx-auto"
        />
      </div>
      <div className="max-w-[1080px] mx-auto relative flex flex-col items-center justify-center mt-40 z-1">
        <SectionBadge title="Features" />
        <div className="w-full px-6 absolute flex flex-row items-center justify-between z-[1] top-[52px]">
          <Image
            src="/images/features-border.svg"
            width={1034}
            height={580}
            alt="Features border"
          />
        </div>
        <h2 className="text-5xl font-semibold text-gray-900 mt-2 bg-landing">
          Without ProxyLink
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
          Third-party cancellations are costly, burdensome, and high-risk.
        </p>
        <div className="relative w-full h-[401px] overflow-hidden z-10">
          {slides.map((slide, index) => (
            <Image
              key={slide}
              src={slide}
              width={1080}
              height={401}
              alt={`ProxyLink Features Slide ${index + 1}`}
              className={`absolute w-full transform transition-transform duration-300 ease-in-out
              ${index === currentSlide ? 'translate-x-0' : ''}
              ${index < currentSlide ? 'translate-x-full' : ''}
              ${index > currentSlide ? '-translate-x-full' : ''}
            `}
            />
          ))}
        </div>
        <p className="text-base text-gray-500 max-w-prose text-center">
          Customers are delegating the task of subscription cancellation to
          third parties (a.k.a. &quot;Proxies&quot;). These proxies are
          processing these cancellations in bulk through traditional customer
          support channels.
        </p>
        <ProxyLinkSwitches switches={switches} onChange={setSwitches} />
      </div>
    </section>
  );
};

export default Features;
