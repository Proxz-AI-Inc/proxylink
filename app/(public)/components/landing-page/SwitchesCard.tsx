import Logo from '@/components/Logo/Logo';
import { Switch } from '@/components/ui/switch';
import { FeatureStep } from './Features';

interface FeaturesToggleProps {
  highlightedFeature: FeatureStep;
  onSelectFeature: (feature: FeatureStep) => void;
}

export function SwitchesCard({
  highlightedFeature,
  onSelectFeature,
}: FeaturesToggleProps) {
  const handleEnabled = () => {
    console.log('highlightedFeature', highlightedFeature);
    if (highlightedFeature === 'enabled') {
      onSelectFeature('disabled');
      return;
    }
    if (highlightedFeature === 'automation') {
      onSelectFeature('disabled');
      return;
    }
    onSelectFeature('enabled');
  };

  const handleAutomation = () => {
    if (highlightedFeature === 'automation') {
      onSelectFeature('enabled');
      return;
    }
    onSelectFeature('automation');
  };

  return (
    <div className="md:rounded-2xl md:bg-white md:p-4 md:shadow-sm">
      <div className="hidden md:flex items-center gap-3 mb-4">
        <Logo width={80} />
      </div>

      <div className="w-full gap-4 md:gap-0 md:space-y-2 flex items-center justify-stretch md:flex-col">
        <div
          // onClick={() => handleSwitch('enabled')}
          className="w-full bg-gray-50 rounded-lg flex items-center justify-between py-[9px] px-[14px] gap-2 border border-violet-600 md:border-none"
        >
          <span className="text-xs flex-1">Enable</span>
          <Switch
            checked={
              highlightedFeature === 'enabled' ||
              highlightedFeature === 'automation'
            }
            onChange={handleEnabled}
            color="green"
            className="h-4 w-[30px]"
          />
        </div>

        <div
          // onClick={() => handleSwitch('automation')}
          className="w-full bg-gray-50 rounded-lg flex items-center justify-between py-[9px] px-[14px] gap-2 border border-violet-600 md:border-none"
        >
          <span className="text-xs flex-1">Automate</span>
          <Switch
            checked={highlightedFeature === 'automation'}
            onChange={handleAutomation}
            color="green"
            className="h-4 w-[30px]"
          />
        </div>
      </div>
    </div>
  );
}
