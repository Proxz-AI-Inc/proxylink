// file: components/Settings/MyNotifications/index.tsx
import { FC } from 'react';
import ProviderNotifications from './ProviderNotifications';
import ProxyNotifications from './ProxyNotifications';
import { useAuth } from '@/hooks/useAuth';

const MyNotificationsTab: FC<{ isEnabled: boolean }> = ({ isEnabled }) => {
  const { userData } = useAuth();
  const isProxy = userData?.tenantType === 'proxy';
  const isProvider = userData?.tenantType === 'provider';

  if (!isEnabled) return null;

  if (isProxy) {
    return <ProxyNotifications />;
  }
  if (isProvider) {
    return <ProviderNotifications />;
  }
};

export default MyNotificationsTab;
