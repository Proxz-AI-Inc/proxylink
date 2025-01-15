'use client';
import { useEffect, useState } from 'react';
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { getUrlForSuccessfullLogin } from './login.utils';

type Props = {
  email: string;
  password: string;
};

const SuccessMessage: React.FC<Props> = ({ email, password }) => {
  const router = useRouter();
  const [status, setStatus] = useState<
    'success' | 'signing-in' | 'complete' | 'error'
  >('success');
  const [message, setMessage] = useState('Success! Account created.');
  const [showLoginButton, setShowLoginButton] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        setStatus('signing-in');
        setMessage('Signing you in...');

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const idToken = await userCredential.user.getIdToken();

        setMessage('Almost there! Preparing your account...');
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to create session');
        }

        setStatus('complete');
        setMessage('Success! Redirecting to your account...');

        const data = await response.json();
        const url = getUrlForSuccessfullLogin(data.tenantType);
        router.push(url);
      } catch (error) {
        console.error('Auto-login failed:', error);
        setStatus('error');
        setMessage('Account created, but automatic login failed.');
        setShowLoginButton(true);
      }
    };

    autoLogin();
  }, [email, password, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'error':
        return (
          <IoMdCloseCircleOutline className="text-red-500 text-8xl my-4" />
        );
      default:
        return (
          <IoMdCheckmarkCircleOutline className="text-green-500 text-8xl my-4" />
        );
    }
  };

  const getMessageColor = () => {
    switch (status) {
      case 'error':
        return 'text-red-500';
      case 'complete':
        return 'text-green-500';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {getStatusIcon()}
      <h2 className={`text-xl text-center ${getMessageColor()}`}>{message}</h2>
      {showLoginButton && (
        <Button className="mt-4" color="primary" href="/login">
          Login
        </Button>
      )}
    </div>
  );
};

export default SuccessMessage;
