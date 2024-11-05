import { Request, User } from '@/lib/db/schema';

export const addParticipantsData = (
  userData: User | null | undefined,
  request: Request,
): Request['participants'] => {
  if (!userData) return request.participants;
  const { tenantType, tenantId, tenantName, email } = userData;
  const isProvider = tenantType === 'provider';
  const isParticipantAlready = isProvider
    ? request.participants?.provider?.emails?.includes(email)
    : request.participants?.proxy?.emails?.includes(email);

  const providerEmails = request.participants?.provider?.emails ?? [];
  const proxyEmails = request.participants?.proxy?.emails ?? [];
  const provider = {
    tenantId,
    tenantName,
    emails: isParticipantAlready ? providerEmails : [...providerEmails, email],
  };
  const proxy = {
    tenantId,
    tenantName,
    emails: isParticipantAlready ? proxyEmails : [...proxyEmails, email],
  };

  return {
    provider: isProvider ? provider : request.participants?.provider,
    proxy: isProvider ? request.participants?.proxy : proxy,
  };
};
