import {
  getProviderEmails,
  getProxyTenantNameById,
} from '@/lib/firebase/tenant.utils';
import { RequestType } from '@/lib/db/schema';
import { EmailTemplateFunction } from './types';
import nodemailer from 'nodemailer';

export interface NewRequestsCreatedData {
  providerTenantId: string;
  proxyTenantId: string;
  proxyTenantName?: string | null;
  requestCount: number;
  type: RequestType;
}

export const NewRequestsCreatedTemplate: EmailTemplateFunction<
  NewRequestsCreatedData
> = data => {
  const subject =
    'New requests have been created for your organization on ProxyLink';

  const requestWord = data.requestCount === 1 ? 'request' : 'requests';

  const text = `Hello,

Your organization has received ${data.requestCount} new ${requestWord} of type ${data.type}${data.proxyTenantName ? ` from ${data.proxyTenantName}.` : '.'}

Please review the requests on the Actions Needed page - https://proxylink.co/actions

Best regards,
ProxyLink Team`;

  const html = `<p>Hello,</p>
<p>Your organization has received <strong>${data.requestCount}</strong> new ${requestWord} of type <strong>${data.type}</strong>${data.proxyTenantName ? ` from <strong>${data.proxyTenantName}</strong>.` : '.'}</p>
<p>Please review the requests on the Actions Needed page - <a href="https://proxylink.co/actions">proxylink.co/actions</a></p>
<p>Best regards,<br/>ProxyLink Team</p>`;

  return { subject, text, html };
};

export const sendUploadNotification = async ({
  providerTenantId,
  proxyTenantId,
  requestCount,
  type,
}: Omit<NewRequestsCreatedData, 'proxyTenantName'>) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing email credentials');
  }

  const allProviderEmails = await getProviderEmails(providerTenantId);

  if (!allProviderEmails.length) {
    return;
  }

  const proxyTenantName = await getProxyTenantNameById(proxyTenantId);
  // Generate the email content
  const { subject, text, html } = NewRequestsCreatedTemplate({
    providerTenantId,
    proxyTenantName,
    proxyTenantId,
    requestCount,
    type,
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
    to: allProviderEmails,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};
