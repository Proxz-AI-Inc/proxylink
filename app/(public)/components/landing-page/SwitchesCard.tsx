import Logo from '@/components/Logo/Logo';
import { Switch } from '@/components/ui/switch';

interface SwitchesCardProps {
  switches: {
    enable: boolean;
    saveOffers: boolean;
    automate: boolean;
  };
  onChange: (values: {
    enable: boolean;
    saveOffers: boolean;
    automate: boolean;
  }) => void;
}

export function SwitchesCard({ switches, onChange }: SwitchesCardProps) {
  const handleSwitchChange =
    (key: keyof typeof switches) => (checked: boolean) => {
      const newValues = { ...switches };

      if (key === 'enable' && !checked) {
        newValues.enable = false;
        newValues.saveOffers = false;
        newValues.automate = false;
      } else if (key === 'saveOffers' && !checked) {
        newValues.saveOffers = false;
        newValues.automate = false;
      } else {
        newValues[key] = checked;
      }

      onChange(newValues);
    };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Logo width={80} />
      </div>

      <div className="divide-y divide-gray-200 bg-gray-50 px-3 rounded-lg">
        <div className="flex items-center justify-between py-4">
          <span className="text-sm">Enable</span>
          <Switch
            checked={switches.enable}
            onChange={handleSwitchChange('enable')}
            color="green"
          />
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm">Save Offers</span>
          <Switch
            checked={switches.saveOffers}
            onChange={handleSwitchChange('saveOffers')}
            disabled={!switches.enable}
            color="green"
          />
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm">Automate</span>
          <Switch
            checked={switches.automate}
            onChange={handleSwitchChange('automate')}
            disabled={!switches.enable || !switches.saveOffers}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}
