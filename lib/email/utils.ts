import nodemailer from 'nodemailer';
import { generateInvitationToken } from '../jwt/utils';
import { TenantType } from '../db/schema';
import path from 'path';
import fs from 'fs/promises';

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

  // Читаем HTML шаблон из текущей директории
  const templatePath = path.join(__dirname, 'welcome.html');
  let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

  // Заменяем переменные
  htmlTemplate = htmlTemplate
    .replace('{{{ page.firstName }}}', sendTo.split('@')[0]) // Берем имя из email
    .replace('{{{ page.inviterName }}}', invitedBy)
    .replace('{{{ page.organization }}}', tenantName)
    .replace('{{{ page.userRole }}}', isAdmin ? 'admin' : 'user')
    .replace('{{{ page.ctaLink }}}', invitationLink);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    subject: isAdmin
      ? 'You are invited to lead on ProxyLink!'
      : 'You are invited to join ProxyLink!',
    html: htmlTemplate,
    // Оставляем текстовую версию как fallback
    text: isAdmin
      ? `Hello,\n\nYou have been invited by ${invitedBy} to join ProxyLink as an admin...`
      : `Hello,\n\nYou have been invited by ${invitedBy} to join ProxyLink...`,
  };

  await transporter.sendMail(mailOptions);
}
