import { Button } from '@/components/ui/button';
import IntegrationsCard from './IntegrationsCard';
import Link from 'next/link';

const Integrations = () => {
  return (
    <div className="relative">
      <div className="max-w-[1080px] mx-auto relative flex flex-col items-center justify-center md:pt-28 text-center z-10">
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

      <div className="mt-12 md:mt-20 mx-auto z-10 w-full px-4 md:px-0">
        <div className="flex flex-row flex-wrap md:flex-nowrap gap-4 md:gap-28  w-full justify-center">
          <IntegrationsCard
            title="Automatically"
            features={[
              'Update Payment Information',
              'Decline Inaccurate Requests',
              'Make Save Offers',
              'Apply Discounts',
              'Pause or Cancel Subscriptions',
            ]}
            className="w-[calc(50%-8px)] md:flex-1 order-1 md:order-1"
          />
          <IntegrationsCard
            title="Optimize"
            features={[
              'A/B test with dynamic save offers.',
              'Achieve the highest retention rates at the lowest cost.',
            ]}
            className="w-[calc(50%-8px)] md:flex-1 order-2 md:order-3"
          />
          <div className="w-full md:w-[530px] order-3 md:order-2 z-10">
            <img
              src="/images/CRM.png"
              width={1597}
              height={856}
              alt="Integrations CRM"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
