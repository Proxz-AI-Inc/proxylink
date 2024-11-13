import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const LandingHero = () => {
  return (
    <section className="max-w-[1080px] mx-auto flex flex-col md:flex-row justify-between">
      <div className="max-w-prose relative top-28">
        <h1 className="text-6xl font-semibold text-gray-900 mb-6">
          Trusted 3rd Party Cancellation Solution
        </h1>
        <p className="text-base text-gray-500 mb-8 w-4/5">
          ProxyLink automates third-party support requests, speeding up
          responses while keeping your processes secure.
        </p>
        <Link href="/schedule-demo">
          <Button color="primary" className="text-lg">
            Get Started for Free
          </Button>
        </Link>
      </div>
      <div className="mt-12 md:mt-0">
        <Image
          src="/images/hero-group.svg"
          width={600}
          height={500}
          alt="ProxyLink customers"
          priority
        />
      </div>
    </section>
  );
};

export default LandingHero;
