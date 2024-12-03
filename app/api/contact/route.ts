import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { emailTemplates } from '@/lib/email/templates';
import { EmailTemplateType } from '@/lib/email/templates/types';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';

/**
 * Handles POST requests to send emails using templates.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response indicating success or failure of email sending.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = request.headers.get('x-tenant-id') ?? 'system';
  const tenantType =
    (request.headers.get('x-tenant-type') as TenantType) ?? 'management';

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.error('Missing email credentials', {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/contact',
      statusCode: 500,
    });
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  try {
    const { templateType, data, to } = await request.json();

    if (!emailTemplates[templateType as EmailTemplateType]) {
      logger.error('Invalid email template type', {
        email,
        tenantId,
        tenantType,
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
      logger.error('Invalid recipient email', {
        email,
        tenantId,
        tenantType,
        method: 'POST',
        route: '/api/contact',
        statusCode: 400,
      });
      return NextResponse.json(
        { error: 'Invalid recipient email' },
        { status: 400 },
      );
    }

    const emailContent =
      emailTemplates[templateType as EmailTemplateType](data);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    logger.info('Email sent successfully', {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/contact',
      statusCode: 200,
    });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    logger.error('Failed to send email', {
      email,
      tenantId,
      tenantType,
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
