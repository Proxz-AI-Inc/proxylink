import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { emailTemplates, EmailTemplateType } from '@/lib/email/templates';
import * as logger from '@/lib/logger/logger';

export async function POST(request: NextRequest) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.error('Missing email credentials', {
      email: request.user?.email || 'anonymous',
      tenantId: 'system',
      tenantType: 'unknown',
      method: 'POST',
      route: '/api/contact',
      statusCode: 500,
    });
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  const { templateType, data, to } = await request.json();

  if (!emailTemplates[templateType as EmailTemplateType]) {
    logger.error('Invalid email template type', {
      email: request.user?.email || 'anonymous',
      tenantId: 'unknown',
      tenantType: 'unknown',
      method: 'POST',
      route: '/api/contact',
      statusCode: 400,
    });
    return NextResponse.json(
      { error: 'Invalid template type' },
      { status: 400 },
    );
  }

  if (!to || typeof to !== 'string') {
    return NextResponse.json(
      { error: 'Invalid recipient email' },
      { status: 400 },
    );
  }

  const emailContent = emailTemplates[templateType as EmailTemplateType](data);

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    logger.error('Failed to send email', {
      email: request.user?.email || 'anonymous',
      tenantId: 'system',
      tenantType: 'management',
      method: 'POST',
      route: '/api/contact',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { error: 'Failed to send the message' },
      { status: 500 },
    );
  }
}
