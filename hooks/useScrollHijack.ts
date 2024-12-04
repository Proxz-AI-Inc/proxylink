import { useEffect, useRef } from 'react';

type ScrollHijackOptions = {
  onProgress?: (progress: number) => void;
  threshold?: number;
};

export const useScrollHijack = (
  ref: React.RefObject<HTMLElement>,
  options: ScrollHijackOptions = {},
) => {
  const scrollPosition = useRef(0);
  const internalScrollRef = useRef(0);
  const isScrollingRef = useRef(false);
  const isUnlockingRef = useRef(false);
  const lastTriggerDirectionRef = useRef<'up' | 'down' | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (!entry.isIntersecting) {
        isUnlockingRef.current = false;
        internalScrollRef.current = 0;
        return;
      }

      if (isAnimatingRef.current) {
        return;
      }

      const rect = entry.boundingClientRect;
      const viewportHeight = window.innerHeight;

      const currentScroll = window.scrollY;
      const scrollingDown = currentScroll > scrollPosition.current;
      const currentDirection = scrollingDown ? 'down' : 'up';
      scrollPosition.current = currentScroll;

      const distanceFromTop = Math.abs(rect.top);
      const distanceFromBottom = Math.abs(rect.bottom - viewportHeight);

      const directionChanged =
        lastTriggerDirectionRef.current !== currentDirection;

      const shouldTrigger = scrollingDown
        ? distanceFromTop <= 100
        : distanceFromBottom <= 100;

      if (shouldTrigger && !isUnlockingRef.current && directionChanged) {
        console.log('Section at trigger point, locking scroll');
        lastTriggerDirectionRef.current = currentDirection;
        isAnimatingRef.current = true;

        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentScroll}px`;
        document.body.style.width = '100%';

        const handleWheel = (e: WheelEvent) => {
          e.preventDefault();

          if (!isScrollingRef.current) {
            const direction = e.deltaY > 0 ? 1 : -1;
            internalScrollRef.current += e.deltaY;
            internalScrollRef.current = Math.max(
              -1000,
              Math.min(internalScrollRef.current, 1000),
            );

            options.onProgress?.(internalScrollRef.current);

            if (
              Math.abs(internalScrollRef.current) >= (options.threshold || 1000)
            ) {
              console.log('Attempting to unlock scroll');

              document.body.style.position = '';
              document.body.style.top = '';
              document.body.style.width = '';

              const finalPosition =
                direction > 0
                  ? scrollPosition.current + 100
                  : scrollPosition.current - 100;

              window.scrollTo({
                top: finalPosition,
                behavior: 'auto',
              });

              window.removeEventListener('wheel', handleWheel);

              setTimeout(() => {
                isUnlockingRef.current = false;
                internalScrollRef.current = 0;
                isAnimatingRef.current = false;
              }, 100);
            }
          }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
          console.log('Cleanup triggered');
          window.removeEventListener('wheel', handleWheel);
        };
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: '0px',
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);
};
