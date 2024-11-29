import { Button } from '@/components/ui/button';
import IntegrationsCard from './IntegrationsCard';
import Link from 'next/link';

const Integrations = () => {
  return (
    <div className="relative mt-[100px]">
      <div className="hidden w-full absolute md:flex flex-row items-center justify-between z-0">
        <img
          src="/images/integrations-bg.svg"
          width={1440}
          height={825}
          alt="Integrations border"
          className="mx-auto"
        />
      </div>

      <div className="max-w-[1080px] mx-auto relative flex flex-col items-center justify-center md:mt-28 md:pt-28 text-center z-10">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 text-center">
          Securely automate
          <br /> subscription management
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
          Effortlessly Connect with Your CRM and Billing Platforms.
        </p>
        <Link href="/schedule-demo">
          <Button color="primary" className="text-lg mt-8">
            Start Automating
          </Button>
        </Link>
      </div>
      <div className="mt-6 md:mt-20 mx-auto z-10 flex flex-wrap md:flex-nowrap gap-6 md:gap-20 items-stretch justify-center w-full px-4 md:px-0">
        <IntegrationsCard
          title="Automatically"
          features={[
            'Update Payment Information',
            'Decline Inaccurate Requests',
            'Make Save Offers',
            'Apply Discounts',
            'Pause or Cancel Subscriptions',
          ]}
          className="mt-10 md:order-1"
        />
        <IntegrationsCard
          title="Optimize"
          features={[
            'A/B test with dynamic save offers.',
            'Achieve the highest retention rates at the lowest cost.',
          ]}
          className="mt-10 md:order-3"
        />
        <img
          src="/images/integrations-scheme.svg"
          width={568}
          height={306}
          alt="Integrations schema"
          className="z-10 w-full md:w-auto mt-8 md:mt-0 md:order-2"
        />
      </div>
    </div>
  );
};

export default Integrations;
