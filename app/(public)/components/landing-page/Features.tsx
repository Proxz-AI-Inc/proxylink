import { useState, useEffect, useMemo } from 'react';
import ProxyLinkSwitches from './ProxyLinkSwitches';
import SectionBadge from './SectionBadge';
import Image from 'next/image';
import clsx from 'clsx';

const Features = () => {
  const [highlightedFeature, setHighlightedFeature] = useState<
    'disabled' | 'enabled' | 'automation'
  >('disabled');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    '/images/features-slide-1-without-proxylink.svg',
    '/images/features-slide-2-enabled.svg',
    '/images/features-slide-3-automatic.svg',
  ];

  useEffect(() => {
    const newIndex = (() => {
      if (highlightedFeature === 'disabled') return 0;
      if (highlightedFeature === 'enabled') return 1;
      return 2; // 'automation' case
    })();

    setCurrentSlide(newIndex);
  }, [highlightedFeature]);

  const onSelectFeature = (feature: 'disabled' | 'enabled' | 'automation') => {
    setHighlightedFeature(feature);
  };

  const FeaturesTitle = useMemo(() => {
    if (highlightedFeature === 'disabled') return 'Without ProxyLink';
    if (highlightedFeature === 'enabled') return 'With ProxyLink';
    return 'With Automations';
  }, [highlightedFeature]);

  const FeaturesDescription = useMemo(() => {
    if (highlightedFeature === 'disabled')
      return 'Third-party cancellations are costly, burdensome, and high-risk.';

    if (highlightedFeature === 'enabled')
      return 'Streamline and secure your cancellation process with ProxyLink. Validate third-party requests, protect customer data, and maintain control over your subscription base.';

    return 'Automate your response to third-party cancellation requests. Set your policies, let ProxyLink handle the rest.';
  }, [highlightedFeature]);

  return (
    <section className="relative p-6 md:p-0 -mt-12 flex items-center gap-24 w-full md:max-w-[1080px] mx-auto justify-between">
      <div className="relative basis-1/2 flex flex-col">
        <SectionBadge title="Features" />
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 bg-landing">
          {FeaturesTitle}
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose">
          {FeaturesDescription}
        </p>
        <ProxyLinkSwitches
          highlightedFeature={highlightedFeature}
          onSelectFeature={onSelectFeature}
        />
      </div>
      <div className="basis-1/2">
        <div className="relative w-full h-[766px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide}
              className={clsx(
                'absolute inset-0 transition-opacity duration-300',
                index === currentSlide ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Image
                src={slides[index]}
                width={337}
                height={766}
                alt={`ProxyLink Features Slide ${index + 1}`}
                className="h-[766px] w-auto object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
