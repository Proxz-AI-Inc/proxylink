// file: components/Settings/MyNotifications/ProviderNotifications.tsx
import { FC, useState } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxField,
} from '@/components/ui/checkbox';
import { NotificationSettings } from '@/lib/api/user';

interface Props {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  isSubmitting: boolean;
}

const MyNotificationsProvider: FC<Props> = ({
  updateSettings,
  settings,
  isSubmitting,
}) => {
  const [isStatusUpdatesChecked, setIsStatusUpdatesChecked] = useState(
    settings.statusUpdates,
  );
  const [
    isOrganizationStatusUpdatesChecked,
    setIsOrganizationStatusUpdatesChecked,
  ] = useState(settings?.organizationStatusUpdates);
  const [isNewRequestsChecked, setIsNewRequestsChecked] = useState(
    settings?.newRequests,
  );

  const handleSettingUpdate =
    (setting: keyof NotificationSettings) => (checked: boolean) => {
      const newSettings = { [setting]: checked };
      if (setting === 'statusUpdates') {
        setIsStatusUpdatesChecked(checked);
      } else if (setting === 'organizationStatusUpdates') {
        setIsOrganizationStatusUpdatesChecked(checked);
      } else if (setting === 'newRequests') {
        setIsNewRequestsChecked(checked);
      }

      updateSettings(newSettings);
    };

  return (
    <div className="flex flex-col gap-4 py-8">
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox
            name="newRequests"
            color="blue"
            checked={isNewRequestsChecked}
            onChange={handleSettingUpdate('newRequests')}
            disabled={isSubmitting}
          />
          <label>
            Notify me when proxies create new requests for my organization
          </label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="organizationStatusUpdates"
            color="blue"
            checked={isOrganizationStatusUpdatesChecked}
            onChange={handleSettingUpdate('organizationStatusUpdates')}
            disabled={isSubmitting}
          />
          <label>
            Notify me of status updates on my organization&apos;s requests
          </label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="statusUpdates"
            color="blue"
            checked={isStatusUpdatesChecked}
            onChange={handleSettingUpdate('statusUpdates')}
            disabled={isSubmitting}
          />
          <label>Notify me of status updates only on my requests</label>
        </CheckboxField>
      </CheckboxGroup>
    </div>
  );
};

export default MyNotificationsProvider;