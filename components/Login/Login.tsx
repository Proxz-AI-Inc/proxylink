// file: app/login/page.tsx
'use client';
import { FC } from 'react';
import LoginForm from '@/components/Login/LoginForm';
import ResetPasswordForm from './ResetPasswordForm';
import SignUpForm from './SignUpForm';
import { NewUserData } from '@/lib/jwt/utils';
import { SignUpResponse } from '@/app/(auth)/signup/page';

import Logo from '../Logo/Logo';
import { Check } from 'lucide-react';

type Props = {
  type?: 'reset-password' | 'sign-up';
  newUserData?: NewUserData | null | 'expired';
  handleSignUp?: (formData: FormData) => Promise<SignUpResponse>;
};

const Login: FC<Props> = ({ type, newUserData, handleSignUp }) => {
  const renderLoginComponent = () => {
    if (type === 'reset-password') return <ResetPasswordForm />;
    if (type === 'sign-up' && handleSignUp) {
      return (
        <SignUpForm newUserData={newUserData} handleSignUp={handleSignUp} />
      );
    }
    return <LoginForm />;
  };

  return (
    <div className="min-h-screen bg-landing flex flex-col w-full justify-center items-center p-32">
      {/* Logo and Title Section */}
      <div className="flex flex-col items-center pt-8 md:pt-16">
        <Logo width={246} />
        <p className="text-gray-500 mt-3 text-lg leading-normal">
          Streamline 3rd-Party Customer Support
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 mt-8">
        <div className="w-full md:max-w-[480px] flex flex-col gap-7">
          {renderLoginComponent()}
          {/* Features Section */}
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-start">
              <Check className="w-4 h-4 text-primary-500 mb-3" />
              <h3 className="text-sm font-medium whitespace-nowrap">
                Enhance Security
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Ensure that all requests submitted by a proxy are authorized by
                your customer.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <Check className="w-4 h-4 text-primary-500 mb-3" />
              <h3 className="text-sm font-medium whitespace-nowrap">
                Resolve Tickets
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                The ProxyLink dashboard makes it faster to resolve tickets
                submitted by a proxy.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <Check className="w-4 h-4 text-primary-500 mb-3" />
              <h3 className="text-sm font-medium whitespace-nowrap">
                Visualize Trends
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Access dashboards to see data trends and charts, helping you
                grasp insights at a glance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
