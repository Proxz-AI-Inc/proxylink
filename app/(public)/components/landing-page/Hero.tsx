import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const LandingHero = () => {
  return (
    <section className="p-6 md:p-0 md:pb-12 w-full md:max-w-[1080px] mx-auto flex flex-col md:flex-row justify-between">
      <div className="w-full md:max-w-prose relative mt-10 md:mt-28">
        <h1 className="text-4xl leading-tight md:text-[56px] font-semibold text-gray-900 mb-6">
          Master Third Party Customer Experience
        </h1>
        <p className="text-base text-gray-500 mb-8">
          Your customers are delegating customer support tasks to third parties
          (a.k.a. &quot;proxies&quot;). ProxyLink gives you full control over
          customer experiences delivered through a proxy.
        </p>
        <div className="mt-16 md:hidden">
          <Image
            src="/images/features-slide-3-automatic-mobile.png"
            width={976}
            height={2112}
            alt="ProxyLink customers"
            priority
            quality={100}
            className="w-full"
          />
        </div>
        <Link
          href="/schedule-demo"
          className="block w-full md:w-fit text-center mt-12 mb-8"
        >
          <Button color="primary" className="text-lg">
            Get Started for Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default LandingHero;
