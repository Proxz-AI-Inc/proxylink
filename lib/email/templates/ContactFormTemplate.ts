import { EmailTemplateFunction, EmailTemplateType } from './types';

export interface ContactFormData {
  email: string;
  message: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
}

export const ContactFormTemplate: EmailTemplateFunction<
  ContactFormData
> = data => {
  const subject = `New Contact Form Submission from ${data.firstName} ${data.lastName}`;
  const text = `
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Message: ${data.message}
  `;
  const html = `
<h1>New Contact Form Submission</h1>
<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone}</p>
<p><strong>Company:</strong> ${data.company}</p>
<p><strong>Message:</strong> ${data.message}</p>
  `;

  return { subject, text, html };
};

export const sendContactFormEmail = async (
  data: ContactFormData,
): Promise<void> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType: 'contactForm' as EmailTemplateType,
        data,
        to: 'john@proxylink.co',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send contact form email');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    throw error;
  }
};
