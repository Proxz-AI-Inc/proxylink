export type EmailTemplateType =
  | 'contactForm'
  | 'dynamicSaveOffer'
  | 'requestDemo';

export interface EmailTemplateResult {
  subject: string;
  text: string;
  html: string;
}

export interface EmailTemplateFunction<T = unknown> {
  (data: T): EmailTemplateResult;
}
