import Logo from '@/components/Logo/Logo';
import { Switch } from '@/components/ui/switch';

interface FeaturesToggleProps {
  highlightedFeature: 'disabled' | 'enabled' | 'automation';
  onSelectFeature: (feature: 'disabled' | 'enabled' | 'automation') => void;
}

export function SwitchesCard({
  highlightedFeature,
  onSelectFeature,
}: FeaturesToggleProps) {
  const handleSwitch = (type: 'enabled' | 'automation') => {
    if (type === 'enabled') {
      if (highlightedFeature === 'disabled') {
        onSelectFeature('enabled');
        return;
      }
      if (
        highlightedFeature === 'automation' ||
        highlightedFeature === 'enabled'
      ) {
        onSelectFeature('disabled');
        return;
      }
    }
    if (type === 'automation') {
      if (highlightedFeature === 'enabled') {
        onSelectFeature('automation');
        return;
      }
      if (highlightedFeature === 'automation') {
        onSelectFeature('enabled');
        return;
      }
    }
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Logo width={80} />
      </div>

      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg flex items-center justify-between py-[9px] px-[14px] gap-2">
          <span className="text-xs">Enable</span>
          <Switch
            checked={
              highlightedFeature === 'enabled' ||
              highlightedFeature === 'automation'
            }
            onChange={() => handleSwitch('enabled')}
            color="green"
            className="h-4 w-[30px]"
            disabled={highlightedFeature === 'automation'}
          />
        </div>

        <div className="bg-gray-50 rounded-lg flex items-center justify-between py-[9px] px-[14px] gap-2">
          <span className="text-xs">Automate</span>
          <Switch
            checked={highlightedFeature === 'automation'}
            onChange={() => handleSwitch('automation')}
            color="green"
            className="h-4 w-[30px]"
            disabled={highlightedFeature === 'disabled'}
          />
        </div>
      </div>
    </div>
  );
}
