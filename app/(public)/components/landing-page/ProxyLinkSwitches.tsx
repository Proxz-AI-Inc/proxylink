'use client';

import { SwitchesCard } from './SwitchesCard';
import { DisabledInfo, EnabledInfo, AutomateInfo } from './FeaturesInfoCards';
import { useMemo } from 'react';
import { FeatureStep } from './Features';

interface FeaturesToggleProps {
  highlightedFeature: 'disabled' | 'enabled' | 'automation';
  onSelectFeature: (feature: FeatureStep) => void;
}

const FeaturesToggle = ({
  highlightedFeature,
  onSelectFeature,
}: FeaturesToggleProps) => {
  const ActiveInfoComponent = useMemo(() => {
    if (highlightedFeature === 'automation') return <AutomateInfo />;
    if (highlightedFeature === 'enabled') return <EnabledInfo />;
    return <DisabledInfo />;
  }, [highlightedFeature]);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center w-full md:w-[420px] mt-6 md:mt-12 z-20">
      <div className="flex-shrink-0 w-full md:w-[160px] order-2 md:order-1">
        <SwitchesCard
          highlightedFeature={highlightedFeature}
          onSelectFeature={onSelectFeature}
        />
      </div>
      <div className="w-full md:w-fit md:flex-shrink-0 text-gray-900 order-1 md:order-2">
        {ActiveInfoComponent}
      </div>
    </div>
  );
};

export default FeaturesToggle;
