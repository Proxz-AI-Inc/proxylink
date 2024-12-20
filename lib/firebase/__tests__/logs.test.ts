import { detectChanges, calculateAverageResponseTime } from '../logs';
import { Request, RequestChange } from '@/lib/db/schema';
import mockLog from './log.mock.json';

describe('detectChanges', () => {
  const author = {
    email: 'employee1@billshark.com',
    tenantType: 'proxy' as const,
    tenantId: '57cc45c3-2d7b-485f-a28a-57833342f8ef',
  };

  const currentRequest: Request = {
    submittedBy: 'employee1@billshark.com',
    notes: null,
    requestType: 'Cancellation',
    providerTenantId: 'ba9270be-6274-41c0-be0a-73e4fe639d39',
    proxyTenantId: '57cc45c3-2d7b-485f-a28a-57833342f8ef',
    participants: {
      proxy: {
        tenantId: '57cc45c3-2d7b-485f-a28a-57833342f8ef',
        emails: ['employee1@billshark.com'],
        tenantName: 'BillShark',
      },
      provider: {
        tenantId: 'ba9270be-6274-41c0-be0a-73e4fe639d39',
        emails: ['support@provider.com'],
        tenantName: 'Provider Corp',
      },
    },
    customerInfo: {
      lastFourCCDigits: '6677',
      customerEmail: 'james.white@example.com',
      accountNumber: '9876543217',
      customerName: 'James White',
    },
    version: 2,
    saveOffer: null,
    logId: 'XpQkPEkCYd2KHcoU0D45',
    id: 'koytT9Bcxo6q7WydfRKD',
    dateSubmitted: '2024-08-14T16:01:50.774Z',
    dateResponded: '2024-08-14T18:16:42.380Z',
    declineReason: [{ field: 'customerEmail', value: 'Wrong Customer Email' }],
    status: 'Declined',
  };

  const updatedRequest: Partial<Request> = {
    customerInfo: {
      lastFourCCDigits: '6677',
      customerEmail: 'james.white@example.ru',
      accountNumber: '9876543217',
      customerName: 'James White',
    },
    declineReason: null,
    status: 'Pending',
  };

  it('should detect changes correctly', () => {
    const changes = detectChanges(currentRequest, updatedRequest, author);
    expect(changes).toEqual([
      {
        field: 'customerInfo.customerEmail',
        oldValue: 'james.white@example.com',
        newValue: 'james.white@example.ru',
        changedBy: author,
        updatedAt: expect.any(Number),
      },
      {
        field: 'declineReason',
        oldValue: [{ field: 'customerEmail', value: 'Wrong Customer Email' }],
        newValue: null,
        changedBy: author,
        updatedAt: expect.any(Number),
      },
      {
        field: 'status',
        oldValue: 'Declined',
        newValue: 'Pending',
        changedBy: author,
        updatedAt: expect.any(Number),
      },
    ]);
  });

  it('should return an empty array if there are no changes', () => {
    const noChangeRequest = {
      ...currentRequest,
    };
    const noChange = detectChanges(currentRequest, noChangeRequest, author);
    expect(noChange).toEqual([]);
  });

  it('should handle null values correctly', () => {
    const currentRequestWithNull = {
      ...currentRequest,
      notes: 'Some notes',
    };
    const updatedRequestWithNull = {
      notes: null,
    };
    const changes = detectChanges(
      currentRequestWithNull,
      updatedRequestWithNull,
      author,
    );
    expect(changes).toEqual([
      {
        field: 'notes',
        oldValue: 'Some notes',
        newValue: null,
        changedBy: author,
        updatedAt: expect.any(Number),
      },
    ]);
  });
});

describe('calculateAverageResponseTime', () => {
  it('should calculate average response time correctly based on provided logs', () => {
    const changes = mockLog.changes as RequestChange[];
    const avgResponseTime = calculateAverageResponseTime(changes);
    expect(avgResponseTime.provider.ms).toBe(30862);
    expect(avgResponseTime.proxy.ms).toBe(70724);
    expect(avgResponseTime.provider.hours).toBe(0.01);
    expect(avgResponseTime.proxy.hours).toBe(0.02);
  });
});
