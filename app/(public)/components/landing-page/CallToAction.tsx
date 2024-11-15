import { Button } from '@/components/ui/button';
import { FC } from 'react';

const CallToAction: FC = () => {
  return (
    <div className="max-w-[1080px] mx-auto relative flex flex-col items-center justify-center pt-24 pb-40 mt-[280px]">
      <h2 className="text-5xl font-semibold text-gray-900 mt-2 bg-landing">
        Ready to get started?
      </h2>
      <p className="text-base text-gray-500 mt-6 max-w-prose text-center">
        Schedule a call with our team to learn more about ProxyLink.
      </p>
      <Button color="primary" className="mt-10">
        Get Started for Free
      </Button>
    </div>
  );
};

export default CallToAction;
