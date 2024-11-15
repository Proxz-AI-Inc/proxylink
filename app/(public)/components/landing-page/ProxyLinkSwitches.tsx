'use client';

import { useState } from 'react';
import { SwitchesCard } from './SwitchesCard';
import {
  DisabledInfo,
  EnabledInfo,
  SaveOffersInfo,
  AutomateInfo,
} from './InfoCards';

// Update props interface
interface ProxyLinkSwitchesProps {
  switches: {
    enable: boolean;
    saveOffers: boolean;
    automate: boolean;
  };
  onChange: (switches: any) => void;
}

const ProxyLinkSwitches = ({ switches, onChange }: ProxyLinkSwitchesProps) => {
  const getActiveInfoComponent = () => {
    if (!switches.enable) return <DisabledInfo />;
    if (!switches.saveOffers) return <EnabledInfo />;
    if (!switches.automate) return <SaveOffersInfo />;
    return <AutomateInfo />;
  };

  return (
    <div className="flex gap-8 items-center w-full mt-12 justify-center">
      <div className="w-[360px] flex-shrink-0">
        <SwitchesCard switches={switches} onChange={onChange} />
      </div>
      <div className="w-[440px] flex-shrink-0 text-gray-900">
        {getActiveInfoComponent()}
      </div>
    </div>
  );
};

export default ProxyLinkSwitches;
