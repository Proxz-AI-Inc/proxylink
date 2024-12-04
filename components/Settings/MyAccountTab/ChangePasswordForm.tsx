'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { validatePassword } from '@/utils/passwordValidation';
import { parseErrorMessage } from '@/utils/general';

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePasswordField = (password: string) => {
    const { isValid, errors } = validatePassword(password);
    setPasswordErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (newPassword !== verifyPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (!validatePasswordField(newPassword)) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setVerifyPassword('');
      setPasswordErrors([]);
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={e => {
              setNewPassword(e.target.value);
              validatePasswordField(e.target.value);
            }}
            className={`mt-1 block w-full rounded-md border ${
              passwordErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2`}
            required
          />
          {passwordErrors.length > 0 && (
            <div className="mt-2 text-sm text-red-500">
              {passwordErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="verifyPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Verify New Password
          </label>
          <input
            type="password"
            id="verifyPassword"
            value={verifyPassword}
            onChange={e => setVerifyPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
        {success && (
          <div className="text-sm text-green-500">
            Password changed successfully
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || newPassword !== verifyPassword}
          loading={loading}
          className="w-fit mt-4"
          color="primary"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};
