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

  const slides = [
    '/images/features-slide-1-without-proxylink.svg',
    '/images/features-slide-2-enabled.svg',
    '/images/features-slide-3-save-offers.svg',
    '/images/features-slide-4-automatic.svg',
  ];

  const slidesMobile = [
    '/images/features-slide-1-without-proxylink-mobile.svg',
    '/images/features-slide-2-enabled-mobile.svg',
    '/images/features-slide-3-save-offers-mobile.svg',
    '/images/features-slide-4-automatic-mobile.svg',
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
      setCurrentSlide(newIndex);
    }
  }, [switches, currentSlide]);

  return (
    <section className="relative p-6 md:p-0 -mt-12">
      <div className="hidden md:block md:absolute inset-0 w-full h-full z-1 top-[-200px]">
        <img
          src="/images/main-bg-start.svg"
          alt="Background"
          className="object-contain w-full md:max-w-[1080px] mx-auto"
        />
      </div>
      <div className="w-full md:max-w-[1080px] mx-auto relative flex flex-col items-center justify-center  md:mt-40 z-1">
        <SectionBadge title="Features" />
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 bg-landing text-center">
          Without ProxyLink
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
          Third-party cancellations are costly, burdensome, and high-risk.
        </p>
        <p className="text-base text-gray-500 max-w-prose text-center">
          Customers are delegating the task of subscription cancellation to
          third parties (a.k.a. &quot;Proxies&quot;). These proxies are
          processing these cancellations in bulk through traditional customer
          support channels.
        </p>
        <ProxyLinkSwitches switches={switches} onChange={setSwitches} />
        <div className="relative w-full h-[766px] md:h-[400px] overflow-hidden z-10">
          {slides.map((slide, index) => (
            <div
              key={slide}
              className={`absolute w-full h-full transform transition-transform duration-300 ease-in-out
                ${index === currentSlide ? 'translate-x-0' : ''}
                ${index < currentSlide ? '-translate-x-full' : ''}
                ${index > currentSlide ? 'translate-x-full' : ''}
              `}
            >
              <Image
                src={slide}
                width={1080}
                height={400}
                alt={`ProxyLink Features Slide ${index + 1}`}
                className="w-full hidden md:block"
              />
              <Image
                src={slidesMobile[index]}
                width={337}
                height={766}
                alt={`ProxyLink Features Slide Mobile ${index + 1}`}
                className="w-full md:hidden"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
