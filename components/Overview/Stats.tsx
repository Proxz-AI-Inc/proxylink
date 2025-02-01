import React, { FC, useMemo } from 'react';
import { RequestWithLog } from '@/lib/db/schema';
import { DonutChart } from '@tremor/react';
import Spinner from '@/components/ui/spinner';

type Props = {
  requests?: RequestWithLog[];
  isLoading: boolean;
};

type StatDonutProps = {
  value: number;
  total: number;
  isLoading: boolean;
  colors: string[];
};

const StatDonut: FC<StatDonutProps> = ({ value, total, isLoading, colors }) => {
  if (isLoading) return null;
  if (!total) return null;

  return (
    <DonutChart
      data={[
        { name: 'Current', amount: value },
        { name: 'Rest', amount: total - value },
      ]}
      index="name"
      category="amount"
      className="h-14 w-14"
      colors={colors}
      showLabel={false}
    />
  );
};

const Stats: FC<Props> = ({ requests, isLoading }) => {
  const resolvedRequestsCount = requests?.filter(
    request =>
      request.status === 'Canceled' || request.status === 'Save Confirmed',
  ).length;

  const declinedRequestsCount = requests?.filter(
    request => request.status === 'Declined',
  ).length;

  const averageTimeToRespondHours = useMemo(() => {
    if (!requests || requests.length === 0) return 0;
    const totalTime = requests.reduce((acc, request) => {
      return acc + (request.log?.avgResponseTime?.provider?.hours || 0);
    }, 0);
    return (totalTime / requests.length).toFixed(1);
  }, [requests]);

  const saveOffersCount = requests?.filter(
    request =>
      request.status === 'Save Accepted' || request.status === 'Save Confirmed',
  ).length;

  const getBackgroundColor = (hours: number) => {
    if (hours < 3) return 'bg-green-200';
    if (hours < 6) return 'bg-yellow-200';
    if (hours < 12) return 'bg-red-100';
    if (hours < 24) return 'bg-red-300';
    return 'bg-blue-200';
  };

  const stats = useMemo(
    () => [
      {
        name: 'Requests',
        stat: isLoading ? <Spinner className="h-6 w-6" /> : requests?.length,
        donut: (
          <StatDonut
            value={requests?.length || 0}
            total={requests?.length || 0}
            isLoading={isLoading}
            colors={['primary-500', 'slate-200']}
          />
        ),
      },
      {
        name: 'Canceled',
        stat: isLoading ? (
          <Spinner className="h-6 w-6" />
        ) : (
          resolvedRequestsCount
        ),
        donut: (
          <StatDonut
            value={resolvedRequestsCount || 0}
            total={requests?.length || 0}
            isLoading={isLoading}
            colors={['green-500', 'slate-200']}
          />
        ),
      },
      {
        name: 'Declined',
        stat: isLoading ? (
          <Spinner className="h-6 w-6" />
        ) : (
          declinedRequestsCount
        ),
        donut: (
          <StatDonut
            value={declinedRequestsCount || 0}
            total={requests?.length || 0}
            isLoading={isLoading}
            colors={['blue-500', 'slate-200']}
          />
        ),
      },
      {
        name: 'Save Offers Accepted',
        stat: isLoading ? (
          <Spinner className="h-6 w-6 text-primary-200 border" />
        ) : (
          saveOffersCount
        ),
      },
      {
        name: 'Avg. Response Time',
        stat: `${averageTimeToRespondHours} hours`,
        backgroundColor: getBackgroundColor(Number(averageTimeToRespondHours)),
      },
    ],
    [
      requests,
      resolvedRequestsCount,
      declinedRequestsCount,
      saveOffersCount,
      isLoading,
      averageTimeToRespondHours,
    ],
  );

  if (!requests) return null;

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      {stats.map(item => (
        <div
          key={item.name}
          className={`overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 ${
            item.backgroundColor || 'bg-white'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <dt className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            </div>
            <div className="">{item.donut}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
