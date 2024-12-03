import { Metadata } from 'next';
import Login from '@/components/Login/Login';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login',
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Login type="reset-password" />;
    </Suspense>
  );
}
