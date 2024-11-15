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
    <div className="max-w-[1080px] mx-auto w-full flex flex-col mb-32">
      <div className="flex items-end justify-between">
        <div>
          <SectionBadge title="PRICING" />
          <h2 className="text-xl font-semibold text-gray-900 mt-2 md:text-5xl md:leading-tight">
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
