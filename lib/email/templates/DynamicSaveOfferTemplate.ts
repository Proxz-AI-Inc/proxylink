import { EmailTemplateFunction } from './types';
export interface DynamicSaveOfferData {
  tenantName?: string;
  tenantEmail?: string;
}

export const DynamicSaveOfferTemplate: EmailTemplateFunction<
  DynamicSaveOfferData
> = data => {
  const subject = 'Dynamic Save Offers Request';
  const text = `
An organization admin has requested to enable Dynamic Save Offers:

Organization Name: ${data.tenantName}
Admin Email: ${data.tenantEmail}

Please review this request.
  `;
  const html = `
<h1>Dynamic Save Offers Request</h1>
<p>An organization admin has requested to enable Dynamic Save Offers:
</p>
<ul>
  <li><strong>Organization Name:</strong> ${data.tenantName}</li>
  <li><strong>Admin Email:</strong> ${data.tenantEmail}</li>
</ul>
<p>Please review this request.</p>
  `;

  return { subject, text, html };
};

export const sendDynamicSaveOfferEmail = async (data: DynamicSaveOfferData) => {
  try {
    if (!data.tenantName || !data.tenantEmail) {
      throw new Error('Tenant name and email are required');
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType: 'dynamicSaveOffer',
        data,
        to: 'john@proxylink.co',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send dynamic save offer email');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send dynamic save offer email:', error);
    throw error;
  }
};
