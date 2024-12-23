import { EmailTemplateFunction, EmailTemplateType } from './types';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  email: string;
}

export const RegisterFormTemplate: EmailTemplateFunction<
  RegisterFormData
> = data => {
  const subject = `New Form Submission from Register Your Brand page`;
  const text = `
  User filled out the form on the proxylink.co/register page.
  
  First Name: ${data.firstName}
  Last Name: ${data.lastName}
  Company Name: ${data.companyName}
  Company Website: ${data.companyWebsite}
  Email: ${data.email}
    `;
  const html = `
  <h1>New Submission on Register Your Brand page</h1>
  <p>User filled out the form on the <a href="https://proxylink.co/register">proxylink.co/register</a> page.</p>
  <p><strong>First Name:</strong> ${data.firstName}</p>
  <p><strong>Last Name:</strong> ${data.lastName}</p>
  <p><strong>Company Name:</strong> ${data.companyName}</p>
  <p><strong>Company Website:</strong> ${data.companyWebsite}</p>
  <p><strong>Email:</strong> ${data.email}</p>
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
