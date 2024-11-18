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
    <div className="h-full w-full flex flex-col p-4 md:p-7 lg:p-32 bg-landing">
      <div className="flex flex-col items-center pt-4 md:pt-8 lg:pt-16">
        <Logo width={180} className="md:w-[246px]" />
        <p className="text-gray-500 mt-2 md:mt-3 text-base md:text-lg leading-normal text-center px-4">
          Streamline 3rd-Party Customer Support
        </p>
      </div>

      <div className="w-full flex flex-col py-8 items-center">
        <div className="w-full md:max-w-[480px] flex flex-col">
          {renderLoginComponent()}
        </div>
        <div className="w-full md:max-w-[480px] mt-8 space-y-6 md:space-y-0 md:flex md:gap-8">
          <div className="md:flex-1 flex flex-col gap-2">
            <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <h3 className="text-sm font-medium">Enhance Security</h3>

            <p className="text-sm text-gray-500">
              Ensure that all requests submitted by a proxy are authorized by
              your customer.
            </p>
          </div>

          <div className="md:flex-1 flex flex-col gap-2">
            <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <h3 className="text-sm font-medium">Resolve Tickets</h3>
            <p className="text-sm text-gray-500">
              The ProxyLink dashboard makes it faster to resolve tickets
              submitted by a proxy.
            </p>
          </div>

          <div className="md:flex-1 flex flex-col gap-2">
            <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <h3 className="text-sm font-medium">Visualize Trends</h3>
            <p className="text-sm text-gray-500">
              Access dashboards to see data trends and charts, helping you grasp
              insights at a glance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
