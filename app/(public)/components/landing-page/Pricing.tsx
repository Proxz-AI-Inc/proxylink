'use client';

import { useState } from 'react';
import SectionBadge from './SectionBadge';
import PricingToggle from './pricing/PricingToggle';
import ProvidersPricing from './pricing/ProvidersPricing';
import ProxiesPricing from './pricing/ProxiesPricing';

const Pricing = () => {
  const [activeType, setActiveType] = useState<'providers' | 'proxies'>(
    'providers',
  );

  return (
    <div className="p-6 mt-14 md:mt-0 md:p-0 md:max-w-[1080px] mx-auto w-full flex flex-col mb-8 md:mb-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-0">
        <div className="flex flex-col">
          <SectionBadge title="PRICING" />
          <h2 className="text-4xl font-semibold text-gray-900 mt-2 md:text-5xl md:leading-tight">
            Bring order to chaos
            <br />
            at no cost
          </h2>
          <p className="text-base text-gray-500 mt-3">
            Our manual tools are free. Only pay for integrations and
            automations.
          </p>
        </div>

        <PricingToggle activeType={activeType} onToggle={setActiveType} />
      </div>

      <div className="mt-12">
        {activeType === 'providers' ? <ProvidersPricing /> : <ProxiesPricing />}
      </div>
      <div id="faq" className="mt-auto" />
    </div>
  );
};

export default Pricing;
