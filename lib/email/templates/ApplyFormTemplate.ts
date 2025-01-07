import { EmailTemplateFunction, EmailTemplateType } from './types';
import applicationReceivedHTML from './application-received.html';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  phone: string;
  email: string;
}

export const ApplyFormNotification: EmailTemplateFunction<
  RegisterFormData
> = data => {
  const subject = `New Form Submission from Register Your Brand page`;
  const text = `
  User filled out the form on the proxylink.co/register page.
  
  First Name: ${data.firstName}
  Last Name: ${data.lastName}
  Company Name: ${data.companyName}
  Company Website: ${data.companyWebsite}
  Phone: ${data.phone}
  Email: ${data.email}
    `;
  const html = `
  <h1>New Submission on Register Your Brand page</h1>
  <p>User filled out the form on the <a href="https://proxylink.co/register">proxylink.co/register</a> page.</p>
  <p><strong>First Name:</strong> ${data.firstName}</p>
  <p><strong>Last Name:</strong> ${data.lastName}</p>
  <p><strong>Company Name:</strong> ${data.companyName}</p>
  <p><strong>Company Website:</strong> ${data.companyWebsite}</p>
  <p><strong>Phone:</strong> ${data.phone}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  `;

  return { subject, text, html };
};

export const sendRegisterFormEmailToProxyLinkTeam = async (
  data: RegisterFormData,
): Promise<void> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType: 'applyFormNotification' as EmailTemplateType,
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

export const WaitlistApplyTemplate: EmailTemplateFunction<
  RegisterFormData
> = () => {
  const subject = `Your application has been received`;
  const text = `
    We received your application 🎉.

    Smart move.

    You’ve taken a step towards a future where customers find brands based on quality of customer experience. 

    We’re now evaluating the online reputation of your brand. If we find that customers love you, we’ll follow up. 

    Best regards,
    ProxyLink Team
  `;
  return { subject, html: applicationReceivedHTML, text };
};

export const sendRegisterFormEmailToAppliedUser = async (
  data: RegisterFormData,
): Promise<void> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType: 'waitlistApply' as EmailTemplateType,
        data,
        to: data.email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send welcome email');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
};
