import { Button } from '@/components/ui/button';
import IntegrationsCard from './IntegrationsCard';
import SectionBadge from './SectionBadge';
import Link from 'next/link';

const Integrations = () => {
  return (
    <div className="relative">
      <div className="w-full absolute flex flex-row items-center justify-between z-0">
        <img
          src="/images/integrations-bg.svg"
          width={1440}
          height={825}
          alt="Integrations border"
        />
      </div>

      <div className="max-w-[1080px] mx-auto relative flex flex-col items-center justify-center mt-28 pt-28 text-center z-10">
        <SectionBadge title="Integrations" />
        <h2 className="text-5xl font-semibold text-gray-900 mt-2 bg-landing max-w-screen-md leading-tight">
          Connect your subscription billing platform and CRM
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
          Effortlessly Connect with Your CRM and Billing Platforms
        </p>
        <Link href="/schedule-demo">
          <Button color="primary" className="text-lg mt-8">
            Start automating
          </Button>
        </Link>
      </div>
      <div className="mt-12 mx-auto z-10 flex flex-row gap-12 items-start justify-center w-full">
        <IntegrationsCard
          title="Automatically"
          features={[
            'Decline Inaccurate Requests',
            'Make Save Offers',
            'Apply Discounts',
            'Pause or Cancel Subscriptions',
          ]}
        />
        <img
          src="/images/integrations-scheme.svg"
          width={568}
          height={306}
          alt="Integrations schema"
        />
        <IntegrationsCard
          title="Optimize"
          features={[
            'A/B test with dynamic save offers.',
            'Achieve the highest retention rates at the lowest cost.',
          ]}
        />
      </div>
    </div>
  );
};

export default Integrations;
