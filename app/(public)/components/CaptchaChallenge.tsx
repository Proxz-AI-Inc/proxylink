'use client';
import { FC } from 'react';
import Turnstile from 'react-turnstile';

const CaptchaChallenge: FC<{ onVerify: (token: string) => void }> = ({
  onVerify,
}) => {
  if (!process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY) {
    console.error('NEXT_PUBLIC_CLOUDFLARE_SITE_KEY is not set');
    return null;
  }

  return (
    <Turnstile
      sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY}
      onVerify={onVerify}
    />
  );
};

export default CaptchaChallenge;
