'use client';

import Head from 'next/head';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import { useCallback } from 'react';

export default function Page() {
  const generateErrors = useCallback(() => {
    const totalErrors = 100;
    let currentError = 0;

    const showNextError = () => {
      if (currentError < totalErrors) {
        Sentry.captureException(new Error(`Test error ${currentError + 1}`));
        toast.error(`Error #${currentError + 1} of ${totalErrors}`, {
          duration: 2000,
          position: 'top-right',
        });
        currentError++;
        setTimeout(showNextError, 50);
      }
    };

    showNextError();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <Toaster />
      <Head>
        <title>Sentry Onboarding</title>
        <meta name="description" content="Test Sentry for your Next.js app!" />
      </Head>

      <main className="flex flex-col items-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Simulate Threats
        </h1>

        <Button onClick={generateErrors} color="red">
          Trigger 100 Simultaneous Errors
        </Button>
      </main>
    </div>
  );
}
