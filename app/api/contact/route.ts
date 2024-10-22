import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { emailTemplates, EmailTemplateType } from '@/lib/email/templates';

export async function POST(request: Request) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  const { templateType, data, to } = await request.json();

  if (!emailTemplates[templateType as EmailTemplateType]) {
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
    console.error('Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send the message' },
      { status: 500 },
    );
  }
}
