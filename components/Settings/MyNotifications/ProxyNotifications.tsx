// file: components/Settings/MyNotificationsProxy.tsx
import { FC, useState } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxField,
} from '@/components/ui/checkbox';
import { NotificationSettings } from '@/lib/api/user';
interface Props {
  updateSettings?: (settings: Partial<NotificationSettings>) => void;
}

const MyNotificationsProxy: FC<Props> = ({ updateSettings }) => {
  const [isStatusUpdatesChecked, setIsStatusUpdatesChecked] = useState(false);
  const [
    isOrganizationStatusUpdatesChecked,
    setIsOrganizationStatusUpdatesChecked,
  ] = useState(false);

  const handleSettingUpdate =
    (setting: keyof NotificationSettings) => (checked: boolean) => {
      const newSettings = { [setting]: checked };

      if (setting === 'statusUpdates') {
        setIsStatusUpdatesChecked(checked);
      } else if (setting === 'organizationStatusUpdates') {
        setIsOrganizationStatusUpdatesChecked(checked);
      }

      updateSettings?.(newSettings);
    };

  return (
    <div className="flex flex-col gap-4 py-8">
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox
            name="organizationStatusUpdates"
            color="blue"
            checked={isOrganizationStatusUpdatesChecked}
            onChange={handleSettingUpdate('organizationStatusUpdates')}
          />
          <label>
            Notify me of status updates on my organization&apos;s requests (in
            development)
          </label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="statusUpdates"
            color="blue"
            checked={isStatusUpdatesChecked}
            onChange={handleSettingUpdate('statusUpdates')}
          />
          <label>Notify me of status updates only on my requests</label>
        </CheckboxField>
      </CheckboxGroup>
    </div>
  );
};

export default MyNotificationsProxy;
