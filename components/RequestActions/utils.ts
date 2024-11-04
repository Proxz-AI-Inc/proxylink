import { Request, User } from '@/lib/db/schema';

export const addParticipantsData = (
  userData: User | null | undefined,
  request: Request,
): Request['participants'] => {
  if (!userData) return request.participants;
  const { tenantType, tenantId, tenantName, email } = userData;
  const isProvider = tenantType === 'provider';
  const isParticipantAlready = isProvider
    ? request.participants?.provider?.emails.includes(email)
    : request.participants?.proxy?.emails.includes(email);

  const provider = {
    tenantId,
    tenantName,
    emails: [
      ...(isParticipantAlready
        ? request.participants?.provider?.emails
        : request.participants?.provider?.emails.concat(email)),
    ],
  };
  const proxy = {
    tenantId,
    tenantName,
    emails: [
      ...(isParticipantAlready
        ? request.participants?.proxy?.emails
        : request.participants?.proxy?.emails.concat(email)),
    ],
  };

  return {
    provider: isProvider ? provider : request.participants?.provider,
    proxy: isProvider ? request.participants?.proxy : proxy,
  };
};
