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
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Logo width={80} />
      </div>

      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg flex items-center justify-between py-[9px] px-[14px] gap-2">
          <span className="text-xs">Enable</span>
          <Switch
            checked={highlightedFeature === 'enabled'}
            onChange={() => onSelectFeature('enabled')}
            color="green"
            className="h-4 w-[30px]"
          />
        </div>

        <div className="bg-gray-50 rounded-lg flex items-center justify-between py-[9px] px-[14px] gap-2">
          <span className="text-xs">Automate</span>
          <Switch
            checked={highlightedFeature === 'automation'}
            onChange={() => onSelectFeature('automation')}
            color="green"
            className="h-4 w-[30px]"
          />
        </div>
      </div>
    </div>
  );
}
