'use client';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MyAccountTab from './MyAccountTab';
import MyTeamTab from './MyTeamTab';
import { useAuth } from '@/hooks/useAuth';
import SaveOffersTab from './SaveOfferTab/SaveOfferTab';
import ProxyFeeAdminTab from './ProxyFeeAdminTab';
import MyCreditsTab from './CreditsTab/MyCreditsTab';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTenant } from '@/hooks/useTenant';
import MyNotificationsTab from './MyNotifications';

const Settings: React.FC<{ tenantId: string }> = ({ tenantId }) => {
  const [activeTab, setActiveTab] = useState('My Account');
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';
  const { data: tenant, refetch } = useTenant(tenantId);

  const isProvider = userData?.tenantType === 'provider';
  const isProxy = userData?.tenantType === 'proxy';
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    router.push(`/settings?tab=${encodeURIComponent(tabName)}`);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const enabledTab = searchParams.get('tab')?.replace(/"/g, '');
  const checkoutSessionId = searchParams.get('session_id');

  useEffect(() => {
    if (enabledTab) {
      setActiveTab(enabledTab);
    }
  }, [enabledTab]);

  const tabs = useMemo(() => {
    return [
      {
        name: 'My Account',
        current: activeTab === 'My Account',
        isEnabled: true,
      },
      {
        name: 'My Notifications',
        current: activeTab === 'My Notifications',
        isEnabled: true,
      },
      {
        name: 'My Team',
        current: activeTab === 'My Team',
        isEnabled: isAdmin,
      },
      {
        name: 'Save Offers',
        current: activeTab === 'Save Offers',
        isEnabled: isProvider && isAdmin,
      },
      {
        name: 'Proxy Fee Admin',
        current: activeTab === 'Proxy Fee Admin',
        isEnabled: isProvider && isAdmin,
      },
      {
        name: 'My Credits',
        current: activeTab === 'My Credits',
        isEnabled: isProxy && isAdmin,
      },
    ];
  }, [activeTab, isAdmin, isProvider, isProxy]);

  const isTabEnabled = useCallback(
    (tabName: string) => {
      const tab = tabs.find(tab => tab.name === tabName);
      return (tab?.isEnabled && tab?.current) ?? false;
    },
    [tabs],
  );

  if (!userData) return null;

  return (
    <div className="flex w-full bg-gray-50">
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-0">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        </div>
        <div>
          <div className="mx-auto w-full px-4">
            <div className="mb-10 mt-6 overflow-hidden border bg-white shadow sm:rounded-lg">
              <div className="p-6">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => {
                      if (!tab.isEnabled) return null;
                      return (
                        <div
                          key={tab.name}
                          onClick={() => handleTabClick(tab.name)}
                          className={clsx(
                            tab.current
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                          )}
                          aria-current={tab.current ? 'page' : undefined}
                        >
                          {tab.name}
                        </div>
                      );
                    })}
                  </nav>
                </div>

                <MyAccountTab
                  userData={userData}
                  tenantName={tenant?.name}
                  isEnabled={isTabEnabled('My Account')}
                />
                <SaveOffersTab
                  isAdmin={userData?.role === 'admin'}
                  offers={tenant?.saveOffers}
                  tenantId={userData?.tenantId}
                  refetch={refetch}
                  isEnabled={isTabEnabled('Save Offers')}
                />
                <ProxyFeeAdminTab isEnabled={isTabEnabled('Proxy Fee Admin')} />
                <MyTeamTab
                  tenantId={tenantId}
                  isEnabled={isTabEnabled('My Team')}
                />
                <MyCreditsTab
                  isEnabled={isTabEnabled('My Credits')}
                  checkoutSessionId={checkoutSessionId}
                />
                <MyNotificationsTab
                  isEnabled={isTabEnabled('My Notifications')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
