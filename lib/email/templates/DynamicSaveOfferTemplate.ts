import { EmailTemplateFunction } from './';

interface DynamicSaveOfferData {
  customerName: string;
  offerDetails: string;
}

export const DynamicSaveOfferTemplate: EmailTemplateFunction<
  DynamicSaveOfferData
> = data => {
  const subject = `Special Offer for ${data.customerName}`;
  const text = `
Dear ${data.customerName},

We value your business and would like to offer you a special deal:

${data.offerDetails}

Thank you for being a valued customer.

Best regards,
Your Company
  `;
  const html = `
<h1>Special Offer for You</h1>
<p>Dear ${data.customerName},</p>
<p>We value your business and would like to offer you a special deal:</p>
<p><strong>${data.offerDetails}</strong></p>
<p>Thank you for being a valued customer.</p>
<p>Best regards,<br>Your Company</p>
  `;

  return { subject, text, html };
};
