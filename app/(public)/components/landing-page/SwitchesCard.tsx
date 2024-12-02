import Logo from '@/components/Logo/Logo';
import { Switch } from '@/components/ui/switch';

interface FeaturesToggleProps {
  highlightedFeature: 'disabled' | 'enabled' | 'automation';
  onSelectFeature: () => void;
}

export function SwitchesCard({ highlightedFeature }: FeaturesToggleProps) {
  // const handleSwitch = (type: 'enabled' | 'automation') => {
  //   if (type === 'automation') {
  //     setAutomation(prev => !prev);
  //   }

  //   if (type === 'enabled') {
  //     setEnabled(prev => !prev);
  //   }

  //   onSelectFeature();
  // };

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
            checked={highlightedFeature === 'enabled'}
            // onChange={() => handleSwitch('enabled')}
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
            // onChange={() => handleSwitch('automation')}
            color="green"
            className="h-4 w-[30px]"
          />
        </div>
      </div>
    </div>
  );
}
