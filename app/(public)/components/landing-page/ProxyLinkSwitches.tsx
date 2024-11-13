'use client';

import { useState } from 'react';
import { SwitchesCard } from './SwitchesCard';
import {
  DisabledInfo,
  EnabledInfo,
  SaveOffersInfo,
  AutomateInfo,
} from './InfoCards';

const ProxyLinkSwitches = () => {
  const [switches, setSwitches] = useState({
    enable: false,
    saveOffers: false,
    automate: false,
  });

  const getActiveInfoComponent = () => {
    if (!switches.enable) return <DisabledInfo />;
    if (!switches.saveOffers) return <EnabledInfo />;
    if (!switches.automate) return <SaveOffersInfo />;
    return <AutomateInfo />;
  };

  return (
    <div className="flex gap-8 items-center w-full mt-12 justify-center">
      <div className="w-[360px] flex-shrink-0">
        <SwitchesCard switches={switches} onChange={setSwitches} />
      </div>
      <div className="w-[440px] flex-shrink-0 text-gray-900">
        {getActiveInfoComponent()}
      </div>
    </div>
  );
};

export default ProxyLinkSwitches;
