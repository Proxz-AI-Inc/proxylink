// file: app/login/login-form.tsx
'use client';
import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import { NewUserData } from '@/lib/jwt/utils';
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from 'react-icons/io';
import { SignUpResponse } from '@/app/(public)/signup/page';
import { validatePassword } from '@/utils/passwordValidation';

const SignUpTokenError = () => {
  return (
    <div className="rounded-lg bg-white shadow w-full min-h-96">
      <div className="space-y-4 p-8 xl:p-16">
        <div className="flex flex-col text-center items-center">
          <div className="mb-4 text-4xl font-bold">
            Invitation link is invalid
          </div>
          <IoMdCloseCircleOutline className="text-red-500 text-8xl my-4" />
          <p className="text-xl">
            Please contact your organization administrator and request a new
            invitation.
          </p>
        </div>
      </div>
    </div>
  );
};

const SucessMessage = () => (
  <div className="flex flex-col items-center justify-center">
    <IoMdCheckmarkCircleOutline className="text-green-500 text-8xl my-4" />
    <h2 className="text-xl text-gray-800 text-center">
      Success! Account created.
    </h2>
    <p>You can now login to your account.</p>
    <Button className="mt-4" color="primary" href="/login">
      Login
    </Button>
  </div>
);

type Props = {
  newUserData: NewUserData | null | 'expired' | undefined;
  handleSignUp: (formData: FormData) => Promise<SignUpResponse>;
};

const SignUpForm: React.FC<Props> = ({
  newUserData = 'expired',
  handleSignUp,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePasswordField = (newPassword: string) => {
    const { isValid, errors } = validatePassword(newPassword);
    setPasswordErrors(errors);
    return isValid;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password before submission
    if (!validatePasswordField(password)) {
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      const response = await handleSignUp(formData);
      if (response.error) {
        setError(response.error);
      } else if (response.user) {
        setError('');
        setSuccessMsg(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const shouldDisableBtn =
    password !== verifiedPassword || password.length < 8 || !newUserData;

  if (newUserData === 'expired' || !newUserData) {
    return <SignUpTokenError />;
  }

  return (
    <div className="rounded-lg bg-white shadow w-full">
      <div className="space-y-4 p-8">
        {successMsg ? (
          <SucessMessage />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col text-left">
              <div className="mb-1 text-2xl md:text-4xl font-bold">
                You are invited to join the{' '}
                <span className="text-primary-500">
                  {newUserData?.tenantName}
                </span>{' '}
                organization on ProxyLink
              </div>
              <p className="text-large text-gray-500">Create your account</p>
            </div>
            <div className="flex items-center space-x-2">
              <hr className="h-px flex-1 border-0 bg-gray-300" />
            </div>
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
                  value={newUserData?.email}
                  disabled
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    First name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Last name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  New Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Minimum 12 characters with uppercase, lowercase, number, and special character"
                  className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border ${
                    passwordErrors.length > 0
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } bg-gray-50 p-2.5 text-gray-900`}
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    validatePasswordField(e.target.value);
                  }}
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
                  htmlFor="verifiedPassword"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Verify Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="verifiedPassword"
                  id="verifiedPassword"
                  placeholder="Type again new password"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                  required
                  value={verifiedPassword}
                  onChange={e => setVerifiedPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full mt-4"
                color="primary"
                disabled={shouldDisableBtn}
                type="submit"
                loading={loading}
              >
                Create account
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
