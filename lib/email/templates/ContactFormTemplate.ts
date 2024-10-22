import { EmailTemplateFunction } from './';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const ContactFormTemplate: EmailTemplateFunction<
  ContactFormData
> = data => {
  const subject = `New Contact Form Submission from ${data.name}`;
  const text = `
Name: ${data.name}
Email: ${data.email}
Message: ${data.message}
  `;
  const html = `
<h1>New Contact Form Submission</h1>
<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Message:</strong> ${data.message}</p>
  `;

  return { subject, text, html };
};
