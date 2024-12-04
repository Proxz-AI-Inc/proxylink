import { useState, useMemo, useRef, useEffect } from 'react';
import ProxyLinkSwitches from './ProxyLinkSwitches';
import Image from 'next/image';
import clsx from 'clsx';

export type FeatureStep = 'disabled' | 'enabled' | 'automation';

const featureOrder = ['disabled', 'enabled', 'automation'] as const;

const Features = () => {
  const [highlightedFeature, setHighlightedFeature] =
    useState<FeatureStep>('disabled');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollPosition = useRef(0);
  const internalScrollRef = useRef(0);
  const isScrollingRef = useRef(false);
  const isUnlockingRef = useRef(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const rect = entry.boundingClientRect;

      if (Math.abs(rect.top) <= 100) {
        console.log('Section at trigger point, locking scroll');
        scrollPosition.current = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition.current}px`;
        document.body.style.width = '100%';

        const handleWheel = (e: WheelEvent) => {
          e.preventDefault();

          if (!isScrollingRef.current) {
            internalScrollRef.current += e.deltaY;
            internalScrollRef.current = Math.max(
              -1000,
              Math.min(internalScrollRef.current, 1000),
            );

            console.log('Scroll progress:', internalScrollRef.current, 'px');

            if (
              Math.abs(internalScrollRef.current) >= 1000 &&
              !isUnlockingRef.current
            ) {
              isUnlockingRef.current = true;
              console.log('Attempting to unlock scroll');

              document.body.style.position = '';
              document.body.style.top = '';
              document.body.style.width = '';

              window.scrollTo({
                top: scrollPosition.current,
                behavior: 'auto',
              });

              observer.disconnect();
              cleanup?.();
            }
          }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        cleanup = () => {
          console.log('Cleanup triggered');
          window.removeEventListener('wheel', handleWheel);
        };
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: '-100px 0px 0px 0px',
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      cleanup?.();
      observer.disconnect();
    };
  }, [currentSlide]);

  const onSelectFeature = (feature: FeatureStep) => {
    setHighlightedFeature(feature);
    setCurrentSlide(featureOrder.indexOf(feature));
  };

  const slides = [
    '/images/features-slide-1-without-proxylink.png',
    '/images/features-slide-2-enabled.png',
    '/images/features-slide-3-automatic.png',
  ];

  const slidesMobile = [
    '/images/features-slide-1-without-proxylink-mobile.png',
    '/images/features-slide-2-enabled-mobile.png',
    '/images/features-slide-3-automatic-mobile.png',
  ];

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
    <section
      ref={sectionRef}
      className="px-6 md:p-0 flex flex-col md:flex-row w-full md:max-w-[1080px] mx-auto justify-between"
    >
      <div className="basis-1/2 flex flex-col md:pt-36">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 bg-landing text-center md:text-left">
          {FeaturesTitle}
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center md:text-left hidden md:block">
          {FeaturesDescription}
        </p>
        <ProxyLinkSwitches
          highlightedFeature={highlightedFeature}
          onSelectFeature={onSelectFeature}
        />
      </div>

      <div className="basis-1/2">
        <div className="relative w-full h-[800px] md:h-[660px]">
          <div className="h-[800px] md:h-[660px] relative mt-12">
            {['disabled', 'enabled', 'automation'].map((feature, index) => (
              <div
                key={feature}
                className={clsx(
                  'absolute inset-0 transition-all duration-700 ease-in-out transform',
                  index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : index < currentSlide
                      ? 'opacity-0 -translate-y-full'
                      : 'opacity-0 translate-y-full',
                )}
              >
                <Image
                  src={slides[index]}
                  width={1690}
                  height={2311}
                  alt={`ProxyLink Features Slide ${index + 1}`}
                  className="h-[664px] w-auto object-contain hidden md:block"
                  priority={index === 0}
                  quality={100}
                />
                <Image
                  src={slidesMobile[index]}
                  width={976}
                  height={2112}
                  alt={`ProxyLink Features Slide ${index + 1}`}
                  className="h-auto md:hidden w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
