// file: components/Settings/MyNotifications/ProviderNotifications.tsx
import { FC } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxField,
} from '@/components/ui/checkbox';

const MyNotificationsProvider: FC = () => {
  return (
    <div className="flex flex-col gap-4 py-8">
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox name="newRequests" color="blue" />
          <label>
            Notify me when proxies create new requests for my organization
          </label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox name="allOrganizationStatusUpdates" color="blue" />
          <label>
            Notify me of status updates on my organization&apos;s requests
          </label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox name="statusUpdates" color="blue" />
          <label>Notify me of status updates only on my requests</label>
        </CheckboxField>
      </CheckboxGroup>
    </div>
  );
};

export default MyNotificationsProvider;
