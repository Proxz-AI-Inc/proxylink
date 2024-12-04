// file: components/Settings/MyNotifications/ProviderNotifications.tsx
import { FC, useState } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxField,
} from '@/components/ui/checkbox';
import { NotificationSettings } from '@/lib/db/schema';

interface Props {
  settings?: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  isSubmitting: boolean;
}

const MyNotifications: FC<Props> = ({
  updateSettings,
  settings,
  isSubmitting,
}) => {
  const [isActionNeededUpdatesChecked, setIsActionNeededUpdatesChecked] =
    useState(settings?.actionNeededUpdates);
  const [
    isOrganizationStatusUpdatesChecked,
    setIsOrganizationStatusUpdatesChecked,
  ] = useState(settings?.organizationStatusUpdates);

  const handleSettingUpdate =
    (setting: keyof NotificationSettings) => (checked: boolean) => {
      const newSettings = { [setting]: checked };
      if (setting === 'actionNeededUpdates') {
        setIsActionNeededUpdatesChecked(checked);
      } else if (setting === 'organizationStatusUpdates') {
        setIsOrganizationStatusUpdatesChecked(checked);
      }

      updateSettings(newSettings);
    };

  return (
    <div className="flex flex-col gap-4 py-8">
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox
            name="actionNeededUpdates"
            color="primary"
            checked={isActionNeededUpdatesChecked}
            onChange={handleSettingUpdate('actionNeededUpdates')}
            disabled={isSubmitting}
          />
          <label>Receive an email every time an action is needed</label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="organizationStatusUpdates"
            color="primary"
            checked={isOrganizationStatusUpdatesChecked}
            onChange={handleSettingUpdate('organizationStatusUpdates')}
            disabled={isSubmitting}
          />
          <label>
            Notify me of status updates on my organization&apos;s requests
          </label>
        </CheckboxField>
      </CheckboxGroup>
    </div>
  );
};

export default MyNotifications;
