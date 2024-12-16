import nodemailer from 'nodemailer';
import { generateInvitationToken } from '../jwt/utils';
import { TenantType } from '../db/schema';
import adminTemplate from './templates/welcome-admin.html';
import userTemplate from './templates/welcome-user.html';

export async function sendEmailInvitation({
  sendTo,
  isAdmin,
  invitedBy,
  tenantType,
  tenantName,
  tenantId,
}: {
  sendTo: string;
  isAdmin: boolean;
  invitedBy: string;
  tenantType: TenantType;
  tenantName: string;
  tenantId: string;
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing email credentials');
  }

  const invitationToken = generateInvitationToken({
    tenantType,
    tenantName,
    tenantId,
    email: sendTo,
    isAdmin,
  });

  let baseUrl: string;
  if (process.env.VERCEL_ENV === 'production') {
    baseUrl = 'https://proxylink.co';
  } else if (process.env.VERCEL_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  } else {
    baseUrl = 'http://localhost:3000';
  }

  const invitationLink = `${baseUrl}/signup?token=${invitationToken}`;

  // Используем импортированные шаблоны
  const htmlTemplate = isAdmin ? adminTemplate : userTemplate;

  // Заменяем переменные в шаблоне
  const templateVars = {
    inviterName: invitedBy,
    organization: tenantName,
    ctaLink: invitationLink,
  };

  console.log('templateVars', templateVars);

  const finalHtml = Object.entries(templateVars).reduce(
    (html, [key, value]) => {
      if (value === undefined) return html;
      return html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    },
    htmlTemplate,
  );

  console.log('finalHtml', finalHtml);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: sendTo,
    subject: 'Welcome to ProxyLink',
    html: finalHtml,
  });
}
