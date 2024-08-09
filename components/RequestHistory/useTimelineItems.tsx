import {
  RequestWithLog,
  RequestStatus as RequestStatusType,
  Request,
} from '@/lib/db/schema';
import { useMemo } from 'react';
import RequestStatus from '../RequestStatus/RequestStatus';
import { groupChanges, renderHistoryTitle, contentMapByField } from './utils';
import { TimelineItemProps } from '@/components/ui/timeline';
import useFirebase from '@/hooks/useFirebase';

type useTimelineItemsReturn = {
  items: TimelineItemProps[];
  titles: { id: string; type: 'proxy' | 'provider'; name: string }[];
};

export const useTimelineItems = (
  request: RequestWithLog | undefined,
): useTimelineItemsReturn => {
  const items = useMemo(() => {
    const dotsMap = {
      proxy: 'border-blue-500',
      provider: 'border-purple-600',
    };
    if (!request) return [];

    const filteredChanges = request.log.changes.filter(
      change => change.field !== 'dateResponded',
    );
    const groups = groupChanges(filteredChanges);

    return groups.map((group, index) => {
      const statusChange = group.changes.find(
        change => change.field === 'status',
      );
      const otherChanges = group.changes.filter(
        change => change.field !== 'status',
      );

      return {
        id: `${group.changedBy}-${index}`,
        content: (
          <div>
            <h4 className="font-bold">{renderHistoryTitle(group)}</h4>
            {otherChanges.map((change, changeIndex) => (
              <p key={changeIndex}>
                {contentMapByField[change.field as keyof Request]?.(
                  change.oldValue,
                  change.newValue,
                  otherChanges,
                )}
              </p>
            ))}
          </div>
        ),
        status: statusChange ? (
          <RequestStatus status={statusChange.newValue as RequestStatusType} />
        ) : undefined,
        date: new Date(group.changes[0].updatedAt).toLocaleString(),
        side: group.tenantType === 'proxy' ? 'right' : 'left',
        borderClass: dotsMap[group.tenantType],
      } as TimelineItemProps;
    });
  }, [request]);

  const { data: tenants } = useFirebase({
    collectionName: 'tenants',
  });

  const titles = useMemo(() => {
    if (!request || !tenants) return [];

    return [
      {
        id: request.proxyTenantId,
        type: 'proxy' as const,
        name:
          tenants.find(t => t.id === request.proxyTenantId)?.name || 'Proxy',
      },
      {
        id: request.providerTenantId,
        type: 'provider' as const,
        name:
          tenants.find(t => t.id === request.providerTenantId)?.name ||
          'Provider',
      },
    ];
  }, [request, tenants]);

  return {
    items,
    titles,
  };
};