// file: components/Settings/MyNotifications/index.tsx
import { FC } from 'react';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateUserData } from '@/lib/api/user';
import { useAuth } from '@/hooks/useAuth';
import MyNotifications from './MyNotifications';
import { NotificationSettings } from '@/lib/db/schema';

const MyNotificationsTab: FC<{ isEnabled: boolean }> = ({ isEnabled }) => {
  const { userData, refetch } = useAuth();

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

  return (
    <MyNotifications
      updateSettings={updateSettingsMutation.mutate}
      settings={userData?.notifications}
      isSubmitting={updateSettingsMutation.isPending}
    />
  );
};

export default MyNotificationsTab;
