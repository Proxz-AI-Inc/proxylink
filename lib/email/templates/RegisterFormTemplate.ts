import { EmailTemplateFunction, EmailTemplateType } from './types';

export interface RegisterFormData {
  email: string;
  tasks: string[];
}

export const RegisterFormTemplate: EmailTemplateFunction<
  RegisterFormData
> = data => {
  const subject = `New Form Submission from Register Your Brand page`;
  const text = `
  User filled out the form on the proxylink.co/register page.
  
  Email: ${data.email}
  Tasks: ${data.tasks.join(', ')}
    `;
  const html = `
  <h1>New Contact Form Submission</h1>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Tasks:</strong> ${data.tasks.join(', ')}</p>
  `;

  return { subject, text, html };
};

export const sendRegisterFormEmail = async (
  data: RegisterFormData,
): Promise<void> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType: 'registerForm' as EmailTemplateType,
        data,
        to: 'sorokinvj@gmail.com',
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
