import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FC } from 'react';

const CallToAction: FC = () => {
  return (
    <div className="w-full p-6 md:max-w-[1080px] mx-auto relative flex flex-col items-center justify-center md:pt-24 pb-40 mt-20 md:mt-[280px]">
      <div className="absolute inset-0 w-full h-full z-[1] md:-mt-24">
        <img
          src="/images/ready-bg.svg"
          alt="Background"
          className="hidden md:block object-contain w-full max-w-[1080px] mx-auto"
        />
      </div>
      <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-2 bg-landing text-center">
        Ready to get started?why
      </h2>
      <p className="text-base text-gray-500 mt-6 max-w-prose text-center">
        Schedule a call with our team to learn more about ProxyLink.
      </p>
      <div className="flex flex-col items-center justify-center relative mt-10 px-10">
        <img
          src="/images/get-started-container.svg"
          alt="Get started"
          className="inset-0 absolute top-1/2 -translate-y-1/2"
          width={270}
        />
        <Link href="/schedule-demo">
          <Button color="primary">Get Started for Free</Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
