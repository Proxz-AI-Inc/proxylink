import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const LandingHero = () => {
  return (
    <section className="p-6 md:p-0 w-full md:max-w-[1080px] mx-auto flex flex-col md:flex-row justify-between">
      <div className="w-full md:max-w-prose relative mt-10 md:mt-28">
        <h1 className="text-4xl leading-tight md:text-[56px] font-semibold text-gray-900 mb-6">
          Master Third Party Customer Experience
        </h1>
        <p className="text-base text-gray-500 mb-8 w-4/5">
          Your customers are delegating customer support tasks to third parties
          (a.k.a. &quot;proxies&quot;). ProxyLink gives you full control over
          customer experiences delivered through a proxy.
        </p>
        <Link href="/schedule-demo">
          <Button color="primary" className="text-lg">
            Get Started for Free
          </Button>
        </Link>
      </div>
      <div className="md:mt-4">
        <Image
          src="/images/hero-group.svg"
          width={332}
          height={678}
          alt="ProxyLink customers"
          priority
          className="w-full"
        />
      </div>
    </section>
  );
};

export default LandingHero;
