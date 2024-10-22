import { ContactFormTemplate } from './ContactFormTemplate';
import { DynamicSaveOfferTemplate } from './DynamicSaveOfferTemplate';

export const emailTemplates = {
  contactForm: ContactFormTemplate,
  dynamicSaveOffer: DynamicSaveOfferTemplate,
};

export type EmailTemplateType = keyof typeof emailTemplates;

export interface EmailTemplateResult {
  subject: string;
  text: string;
  html: string;
}

export interface EmailTemplateFunction<T = unknown> {
  (data: T): EmailTemplateResult;
}
