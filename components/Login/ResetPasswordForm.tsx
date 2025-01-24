'use client';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUrlForSuccessfullLogin } from './login.utils';

const ResetPasswordForm: React.FC = () => {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const [resetStatus, setResetStatus] = useState<
    'idle' | 'reset' | 'signing-in' | 'complete'
  >('idle');

  useEffect(() => {
    if (oobCode && mode === 'resetPassword') {
      verifyPasswordResetCode(auth, oobCode as string)
        .then(email => {
          setIsCodeValid(true);
          setUserEmail(email);
        })
        .catch(error => {
          console.error('Invalid or expired reset code:', error);
          setMessage('Invalid or expired reset code.');
        });
    }
  }, [oobCode, mode]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setResetStatus('reset');
      setMessage('Resetting your password...');

      // 1. Reset password
      await confirmPasswordReset(auth, oobCode as string, newPassword);
      setMessage('Password reset successful! Signing you in...');

      // 2. Automatic login
      setResetStatus('signing-in');
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        newPassword,
      );

      setMessage('Almost there! Preparing your account...');
      // 3. Getting token and creating session
      const idToken = await userCredential.user.getIdToken();
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

      // 4. Redirect
      setResetStatus('complete');
      setMessage('Success! Redirecting you to your account...');
      const data = await response.json();
      const url = getUrlForSuccessfullLogin(data.tenantType);
      router.push(url);
    } catch (error) {
      console.error('Error during password reset and login:', error);
      if (resetStatus === 'reset') {
        setMessage('Failed to reset password. Please try again.');
      } else if (resetStatus === 'signing-in') {
        setMessage(
          'Password reset successful, but automatic login failed. Please try logging in manually.',
        );
        setShowLoginButton(true);
      }
      setResetStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your email for password reset instructions.');
      // Optionally redirect the user or provide further instructions
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setMessage('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (resetStatus) {
      case 'reset':
        return 'Resetting your password...';
      case 'signing-in':
        return 'Signing you in...';
      case 'complete':
        return 'Success! Redirecting...';
      default:
        return message;
    }
  };

  if (oobCode && isCodeValid) {
    return (
      <div className="rounded-lg bg-white shadow max-w-lg w-full">
        <div className="space-y-4 p-8">
          <div className="flex flex-col text-left">
            <div className="mb-1 text-2xl font-bold text-gray-900">
              Reset password
            </div>
            <div className="text-base text-gray-500">
              Enter your new password
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <hr className="h-px flex-1 border-0 bg-gray-300" />
          </div>

          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                New Password
              </label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                placeholder="New password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            {!showLoginButton && (
              <Button
                className="w-full"
                disabled={loading || showLoginButton}
                type="submit"
                loading={loading}
                color="primary"
              >
                Reset Password
              </Button>
            )}
            {message && (
              <p
                className={`font-bold text-base text-center ${
                  resetStatus === 'complete'
                    ? 'text-green-500'
                    : 'text-gray-500'
                }`}
              >
                {getStatusMessage()}
              </p>
            )}
            {showLoginButton && (
              <p className="font-bold text-base text-center text-primary-500">
                <Button href="/login" className="w-full" color="dark/white">
                  Login
                </Button>
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow max-w-lg w-full">
      <div className="space-y-4 p-8 xl:p-16">
        <div className="flex flex-col text-left">
          <div className="mb-1 text-2xl font-bold text-gray-900">
            Reset password
          </div>
          <div className="text-large text-gray-500">Enter your email</div>
        </div>
        <div className="flex items-center space-x-2">
          <hr className="h-px flex-1 border-0 bg-gray-300" />
        </div>

        <form className="space-y-4" onSubmit={handleSendResetEmail}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
              placeholder="name@company.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            color="primary"
            disabled={loading}
            type="submit"
            loading={loading}
          >
            Send Reset Email
          </Button>
          {message && (
            <p className="font-bold text-base text-gray-500">{message}</p>
          )}
          <p className="text-sm font-light text-gray-500">
            Remembered your password?{' '}
            <span className="text-primary-500 font-medium hover:underline">
              <Link href="/login">Login</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
