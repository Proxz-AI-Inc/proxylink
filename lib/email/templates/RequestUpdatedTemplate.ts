import { RequestChange, RequestType, TenantType } from '@/lib/db/schema';
import { EmailTemplateFunction } from '.';

import {
  groupChanges,
  renderHistoryTitle,
  renderDescription,
} from '@/components/RequestHistory/RequestHistoryContent';
import nodemailer from 'nodemailer';
import { Request } from '@/lib/db/schema';

export interface RequestUpdatedData {
  requestId: string;
  requestType: RequestType;
  changes: RequestChange[];
  recipientTenantType: TenantType;
}

export const RequestUpdatedTemplate: EmailTemplateFunction<
  RequestUpdatedData
> = data => {
  const groups = groupChanges(data.changes);
  const latestGroup = groups[0];

  const title = renderHistoryTitle(latestGroup);
  const description = renderDescription(latestGroup.changes);

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

  // Get the author of the changes
  const author = changes[0].changedBy;

  // Determine recipients based on who made the changes
  const recipientEmails =
    author.tenantType === 'proxy'
      ? request.participants.provider.emails
      : request.participants.proxy.emails;

  if (!recipientEmails.length) {
    throw new Error('No recipient emails found for notification');
  }

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
    to: recipientEmails,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};
