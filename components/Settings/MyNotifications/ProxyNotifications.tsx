// file: components/Settings/MyNotificationsProxy.tsx
import { FC } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxField,
} from '@/components/ui/checkbox';

const MyNotificationsProxy: FC = () => {
  return (
    <div className="flex flex-col gap-4 py-8">
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox name="allOrganizationStatusUpdates" color="blue" disabled />
          <label>
            Notify me of status updates on my organization&apos;s requests (in
            development)
          </label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox name="statusUpdates" color="blue" checked />
          <label>Notify me of status updates only on my requests</label>
        </CheckboxField>
      </CheckboxGroup>
    </div>
  );
};

export default MyNotificationsProxy;
