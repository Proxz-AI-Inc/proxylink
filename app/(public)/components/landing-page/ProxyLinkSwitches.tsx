'use client';

import { SwitchesCard } from './SwitchesCard';
import { DisabledInfo, EnabledInfo, AutomateInfo } from './FeaturesInfoCards';
import { useMemo } from 'react';

interface FeaturesToggleProps {
  highlightedFeature: 'disabled' | 'enabled' | 'automation';
  onSelectFeature: (feature: 'disabled' | 'enabled' | 'automation') => void;
}

const FeaturesToggle = ({
  highlightedFeature,
  onSelectFeature,
}: FeaturesToggleProps) => {
  const ActiveInfoComponent = useMemo(() => {
    if (highlightedFeature === 'disabled') return <DisabledInfo />;
    if (highlightedFeature === 'enabled') return <EnabledInfo />;
    return <AutomateInfo />;
  }, [highlightedFeature]);

  return (
    <div className="flex gap-4 md:gap-8 items-center w-full md:w-[420px] mt-6 md:mt-12 z-20">
      <div className="flex-shrink-0 w-[160px]">
        <SwitchesCard
          highlightedFeature={highlightedFeature}
          onSelectFeature={onSelectFeature}
        />
      </div>
      <div className="w-full md:flex-shrink-0 text-gray-900">
        {ActiveInfoComponent}
      </div>
    </div>
  );
};

export default FeaturesToggle;
