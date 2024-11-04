// file: components/Settings/MyNotifications/index.tsx
import { FC } from 'react';
import ProviderNotifications from './ProviderNotifications';
import ProxyNotifications from './ProxyNotifications';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { NotificationSettings, updateUserData } from '@/lib/api/user';

const MyNotificationsTab: FC<{ isEnabled: boolean }> = ({ isEnabled }) => {
  const { userData, refetch } = useAuth();
  const isProxy = userData?.tenantType === 'proxy';
  const isProvider = userData?.tenantType === 'provider';

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Partial<NotificationSettings>) =>
      updateUserData({
        userId: userData?.id,
        data: {
          notifications: {
            ...(userData?.notifications ?? { statusUpdates: true }),
            ...settings,
          },
        },
      }),
    onSuccess: async () => {
      await refetch();
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  if (!isEnabled) return null;

  if (isProxy) {
    return (
      <ProxyNotifications
        updateSettings={updateSettingsMutation.mutate}
        settings={userData?.notifications}
      />
    );
  }
  if (isProvider) {
    return (
      <ProviderNotifications
        updateSettings={updateSettingsMutation.mutate}
        settings={userData?.notifications}
      />
    );
  }
};

export default MyNotificationsTab;
