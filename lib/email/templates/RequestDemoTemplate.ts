import { EmailTemplateFunction, EmailTemplateType } from './types';
import { ContactFormData } from './ContactFormTemplate';

export interface RequestDemoTemplateProps {
  email: string;
  message: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
}

export const RequestDemoTemplate: EmailTemplateFunction<
  RequestDemoTemplateProps
> = data => {
  const subject = `New Demo Request from ${data.firstName} ${data.lastName}`;
  const text = `
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Message: ${data.message}
  `;
  const html = `
<h1>New Demo Request</h1>
<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone}</p>
<p><strong>Company:</strong> ${data.company}</p>
<p><strong>Message:</strong> ${data.message}</p>
  `;

  return { subject, text, html };
};

export const sendDemoRequestEmail = async (
  data: ContactFormData,
): Promise<void> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType: 'requestDemo' as EmailTemplateType,
        data,
        to: 'john@proxylink.co',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send demo request email');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send demo request email:', error);
    throw error;
  }
};
