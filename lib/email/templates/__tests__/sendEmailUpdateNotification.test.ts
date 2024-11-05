import { sendEmailUpdateNotification } from '../RequestUpdatedTemplate';
import { getFirestore } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Request, RequestChange, User } from '@/lib/db/schema';

// Mock Firebase and nodemailer
jest.mock('firebase-admin/firestore');
jest.mock('nodemailer');

const mockRequest: Request = {
  id: 'request-1',
  version: 2,
  status: 'Declined',
  submittedBy: 'participant1@proxy.com',
  requestType: 'Cancellation',
  dateSubmitted: '2024-03-14T12:00:00Z',
  dateResponded: '2024-03-14T13:00:00Z',
  proxyTenantId: 'proxy-1',
  providerTenantId: 'provider-1',
  participants: {
    proxy: {
      emails: ['participant1@proxy.com'],
      tenantId: 'proxy-1',
      tenantName: 'Proxy Corp',
    },
    provider: {
      emails: ['participant1@provider.com'],
      tenantId: 'provider-1',
      tenantName: 'Provider Corp',
    },
  },
  customerInfo: {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    accountNumber: '12345',
    lastFourCCDigits: '4242',
  },
  saveOffer: null,
  declineReason: null,
  notes: null,
  logId: 'log-1',
};

const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'participant1@provider.com',
    firstName: 'John',
    lastName: 'Provider',
    tenantId: 'provider-1',
    tenantType: 'provider',
    notifications: {
      statusUpdates: true,
      organizationStatusUpdates: false,
      newRequests: true,
    },
    createdAt: '2024-03-14T12:00:00Z',
  },
  {
    id: 'user-2',
    email: 'support@provider.com',
    firstName: 'Support',
    lastName: 'Agent',
    tenantId: 'provider-1',
    tenantType: 'provider',
    notifications: {
      statusUpdates: false,
      organizationStatusUpdates: true,
      newRequests: true,
    },
    createdAt: '2024-03-14T12:00:00Z',
  },
  {
    id: 'user-3',
    email: 'disabled@provider.com',
    firstName: 'Disabled',
    lastName: 'User',
    tenantId: 'provider-1',
    tenantType: 'provider',
    notifications: {
      statusUpdates: false,
      organizationStatusUpdates: false,
      newRequests: false,
    },
    createdAt: '2024-03-14T12:00:00Z',
  },
] as User[];

const mockChanges: RequestChange[] = [
  {
    field: 'status',
    oldValue: 'Pending',
    newValue: 'Declined',
    changedBy: {
      email: 'participant1@proxy.com',
      tenantType: 'proxy',
      tenantId: 'proxy-1',
    },
    updatedAt: Date.now(),
  },
];

describe('sendEmailUpdateNotification', () => {
  let sendMailMock: jest.Mock;

  beforeEach(() => {
    // Setup environment variables
    process.env.EMAIL_USER = 'test@email.com';
    process.env.EMAIL_PASS = 'password';

    // Mock Firestore query
    const mockGet = jest.fn().mockResolvedValue({
      docs: mockUsers.map(user => ({
        data: () => user,
      })),
    });

    const mockWhere = jest.fn().mockReturnValue({ get: mockGet });
    const mockCollection = jest.fn().mockReturnValue({ where: mockWhere });

    (getFirestore as jest.Mock).mockReturnValue({
      collection: mockCollection,
    });

    // Setup nodemailer mock with proper typing
    sendMailMock = jest.fn().mockResolvedValue(true);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email only to eligible recipients', async () => {
    await sendEmailUpdateNotification({
      changes: mockChanges,
      request: mockRequest,
    });

    // Verify email was sent with correct recipients
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: expect.arrayContaining([
          'participant1@provider.com', // Has statusUpdates enabled
          'support@provider.com', // Has organizationStatusUpdates enabled
        ]),
      }),
    );

    // Get the mail options from the mock call
    const [mailOptions] = sendMailMock.mock.calls[0] as [Mail.Options];
    expect(mailOptions.to).not.toContain('disabled@provider.com');
  });

  it('should not send email if no eligible recipients', async () => {
    const mockUsersNoNotifications = mockUsers.map(user => ({
      ...user,
      notifications: {
        statusUpdates: false,
        organizationStatusUpdates: false,
      },
    }));

    // Update Firestore mock to return users with no notifications
    const mockGet = jest.fn().mockResolvedValue({
      docs: mockUsersNoNotifications.map(user => ({
        data: () => user,
      })),
    });

    (getFirestore as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({ get: mockGet }),
      }),
    });

    await sendEmailUpdateNotification({
      changes: mockChanges,
      request: mockRequest,
    });

    // Verify no email was sent
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('should throw error if email credentials are missing', async () => {
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

    await expect(
      sendEmailUpdateNotification({
        changes: mockChanges,
        request: mockRequest,
      }),
    ).rejects.toThrow('Missing email credentials');
  });
});
