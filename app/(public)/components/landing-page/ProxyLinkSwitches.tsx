'use client';

import { SwitchesCard } from './SwitchesCard';
import {
  DisabledInfo,
  EnabledInfo,
  SaveOffersInfo,
  AutomateInfo,
} from './InfoCards';

type Switches = {
  enable: boolean;
  saveOffers: boolean;
  automate: boolean;
};

interface ProxyLinkSwitchesProps {
  switches: Switches;
  onChange: (switches: Switches) => void;
}

const ProxyLinkSwitches = ({ switches, onChange }: ProxyLinkSwitchesProps) => {
  const getActiveInfoComponent = () => {
    if (!switches.enable) return <DisabledInfo />;
    if (!switches.saveOffers) return <EnabledInfo />;
    if (!switches.automate) return <SaveOffersInfo />;
    return <AutomateInfo />;
  };

  return (
    <div className="flex gap-4 md:gap-8 items-center w-full mt-12 justify-center z-20">
      <div className="w-1/2 md:w-[360px] flex-shrink-0">
        <SwitchesCard switches={switches} onChange={onChange} />
      </div>
      <div className="w-1/2 md:w-[440px] flex-shrink-0 text-gray-900">
        {getActiveInfoComponent()}
      </div>
    </div>
  );
};

export default ProxyLinkSwitches;
