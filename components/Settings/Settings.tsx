'use client';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MyAccountTab from './MyAccountTab/MyAccountTab';
import MyTeamTab from './MyTeamTab';
import { useAuth } from '@/hooks/useAuth';
import SaveOffersTab from './SaveOfferTab/SaveOfferTab';
import MyCreditsTab from './CreditsTab/MyCreditsTab';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTenant } from '@/hooks/useTenant';
import MyNotificationsTab from './MyNotifications';
import AuthenticationFieldsTab from './AuthenticationFieldsTab';

type Tabs =
  | 'Account'
  | 'Notifications'
  | 'Authentication Fields'
  | 'Team'
  | 'Save Offers'
  | 'Credits';

const Settings: React.FC<{ tenantId: string }> = ({ tenantId }) => {
  const [activeTab, setActiveTab] = useState<Tabs>('Account');
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';
  const { data: tenant, refetch } = useTenant(tenantId);

  const isProvider = userData?.tenantType === 'provider';
  const isProxy = userData?.tenantType === 'proxy';

  const router = useRouter();
  const searchParams = useSearchParams();
  const enabledTab = searchParams.get('tab')?.replace(/"/g, '') as Tabs;
  const checkoutSessionId = searchParams.get('session_id');

  useEffect(() => {
    if (enabledTab) {
      setActiveTab(enabledTab);
    }
  }, [enabledTab]);

  const handleTabClick = (tabName: Tabs) => {
    setActiveTab(tabName);
    router.push(`/settings?tab=${encodeURIComponent(tabName)}`);
  };

  const tabs = useMemo(() => {
    return [
      {
        name: 'Account' as Tabs,
        current: activeTab === 'Account',
        isEnabled: true,
      },
      {
        name: 'Notifications' as Tabs,
        current: activeTab === 'Notifications',
        isEnabled: true,
      },
      {
        name: 'Authentication Fields' as Tabs,
        current: activeTab === 'Authentication Fields',
        isEnabled: isProvider && isAdmin,
      },
      {
        name: 'Team' as Tabs,
        current: activeTab === 'Team',
        isEnabled: isAdmin,
      },
      {
        name: 'Save Offers' as Tabs,
        current: activeTab === 'Save Offers',
        isEnabled: isProvider && isAdmin,
      },
      {
        name: 'Credits' as Tabs,
        current: activeTab === 'Credits',
        isEnabled: isProxy && isAdmin,
      },
    ];
  }, [activeTab, isAdmin, isProvider, isProxy]);

  const isTabEnabled = useCallback(
    (tabName: Tabs) => {
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
                              ? 'border-primary-500 text-primary-500'
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
                  isEnabled={isTabEnabled('Account')}
                />
                <SaveOffersTab
                  isAdmin={userData?.role === 'admin'}
                  offers={tenant?.saveOffers}
                  tenantId={userData?.tenantId}
                  refetch={refetch}
                  isEnabled={isTabEnabled('Save Offers')}
                />
                <MyTeamTab
                  tenantId={tenantId}
                  isEnabled={isTabEnabled('Team')}
                />
                <MyCreditsTab
                  isEnabled={isTabEnabled('Credits')}
                  checkoutSessionId={checkoutSessionId}
                />
                <MyNotificationsTab isEnabled={isTabEnabled('Notifications')} />
                <AuthenticationFieldsTab
                  tenantId={tenantId}
                  isEnabled={isTabEnabled('Authentication Fields')}
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
