import {
  DeclineReason,
  RequestChange,
  RequestType,
  TenantType,
  User,
} from '@/lib/db/schema';
import { EmailTemplateFunction } from '.';

import {
  groupChanges,
  renderHistoryTitle,
} from '@/components/RequestHistory/RequestHistoryContent';
import nodemailer from 'nodemailer';
import { Request } from '@/lib/db/schema';
import { getFirestore } from 'firebase-admin/firestore';
import { getCustomerFieldDisplayName } from '@/utils/template.utils';

export interface RequestUpdatedData {
  requestId: string;
  requestType: RequestType;
  changes: RequestChange[];
  recipientTenantType: TenantType;
}

export const renderDescriptionAsText = (
  changes: RequestChange[],
): string | null => {
  const saveOfferChangeTitle = changes.find(
    change => change.field === 'saveOffer.title',
  );

  if (saveOfferChangeTitle) {
    return `Offer: ${saveOfferChangeTitle.newValue as string}`;
  }

  const declineReasonChange = changes.find(
    change => change.field === 'declineReason',
  );
  if (declineReasonChange) {
    if (
      declineReasonChange.newValue === null &&
      declineReasonChange.oldValue !== null
    ) {
      const customerInfoChanges = changes.filter(change =>
        change.field.includes('customerInfo.'),
      );
      if (customerInfoChanges.length > 0) {
        return customerInfoChanges
          .map(change => {
            const customerFieldChanged = change.field.split('.')[1];
            return `${getCustomerFieldDisplayName(customerFieldChanged)} has been updated`;
          })
          .join(', ');
      }
    }
    const declineReasons = (declineReasonChange.newValue as DeclineReason[])
      ?.map((reason: DeclineReason) => {
        return `Wrong ${getCustomerFieldDisplayName(reason.field)}`;
      })
      .join(', ');
    return `Reason: ${declineReasons}`;
  }

  return null;
};

export const RequestUpdatedTemplate: EmailTemplateFunction<
  RequestUpdatedData
> = data => {
  const groups = groupChanges(data.changes);
  const latestGroup = groups[0];

  const title = renderHistoryTitle(latestGroup);
  const description = renderDescriptionAsText(latestGroup.changes);

  const subject = `ProxyLink Request Update: ${title}`;

  const text = `Hello,

${title}
${description ? `\n${description}` : ''}

You can view the request details at: https://proxylink.co/requests/${data.requestId}

Best regards,
ProxyLink Team`;

  const html = `<p>Hello,</p>
<p><strong>${title}</strong></p>
${description ? `<p>${description}</p>` : ''}
<p>You can view the request details at: <a href="https://proxylink.co/requests/${data.requestId}">proxylink.co/requests/${data.requestId}</a></p>
<p>Best regards,<br/>ProxyLink Team</p>`;

  return { subject, text, html };
};

export const sendEmailUpdateNotification = async ({
  changes,
  request,
}: {
  changes: RequestChange[];
  request: Request;
}) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing email credentials');
  }

  const author = changes[0].changedBy;
  const targetTenantId =
    author.tenantType === 'proxy'
      ? request.providerTenantId
      : request.proxyTenantId;

  // Get ALL users from the target organization
  const db = getFirestore();
  const usersRef = db.collection('users');
  const usersSnapshot = await usersRef
    .where('tenantId', '==', targetTenantId)
    .get();

  // Filter recipients based on their notification preferences
  const eligibleRecipients = usersSnapshot.docs
    .map(doc => doc.data() as User)
    .filter(user => {
      if (!user.notifications) return false;

      // Check if user is a participant in this request
      const isParticipant =
        request.participants?.provider?.emails.includes(user.email) ||
        request.participants?.proxy?.emails.includes(user.email);

      // If participant, check statusUpdates
      if (isParticipant) {
        return user.notifications?.statusUpdates;
      }

      // If not participant but wants org updates
      return user.notifications?.organizationStatusUpdates;
    })
    .map(user => user.email);

  if (!eligibleRecipients.length) return;

  const { subject, text, html } = RequestUpdatedTemplate({
    requestId: request.id,
    requestType: request.requestType,
    changes,
    recipientTenantType: author.tenantType === 'proxy' ? 'provider' : 'proxy',
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: eligibleRecipients,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};
