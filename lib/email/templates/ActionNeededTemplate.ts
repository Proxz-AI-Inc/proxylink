import { EmailTemplateFunction } from '.';
export interface DynamicSaveOfferData {}

export const ActionNeededTemplate: EmailTemplateFunction<
  DynamicSaveOfferData
> = data => {
  const subject = 'Action Needed';
  const text = '';
  const html = ``;

  return { subject, text, html };
};
