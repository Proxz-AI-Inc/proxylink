import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CaptchaChallenge from '../CaptchaChallenge';
import {
  sendRegisterFormEmailToAppliedUser,
  sendRegisterFormEmailToProxyLinkTeam,
} from '@/lib/email/templates/ApplyFormTemplate';
import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addApplicationToSheet } from '@/lib/api/sheet';

type Props = {
  onSubmit: () => void;
};

type CaptchaVerifyRes = {
  success: boolean;
  error?: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  phone: string;
  email: string;
};

const formatPhoneNumber = (value: string) => {
  // Remove all non-digits
  const numbers = value.replace(/\D/g, '');

  // Format as XXX-XXX-XXXX
  if (numbers.length >= 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  } else if (numbers.length >= 6) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length >= 3) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }
  return numbers;
};

const WaitlistForm: FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

  const sheetMutation = useMutation({
    mutationFn: async () => {
      const currentDate = new Date().toISOString().split('T')[0];
      return addApplicationToSheet({
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        firstName: formData.firstName,
        lastName: formData.lastName,
        workEmail: formData.email,
        phoneNumber: formData.phone,
        dateApplied: currentDate,
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (token: string): Promise<CaptchaVerifyRes> => {
      const response = await fetch('/api/captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error('Captcha verification failed');
      }
      return data;
    },
    onSuccess: async () => {
      try {
        await Promise.all([
          sendRegisterFormEmailToProxyLinkTeam(formData),
          sendRegisterFormEmailToAppliedUser(formData),
          sheetMutation.mutateAsync(),
        ]);
        onSubmit();
      } catch (error) {
        setError('Unable to process your application. Please try again later.');
      }
    },
    onError: () => {
      setError('Unable to verify. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    verifyMutation.mutate(captchaToken);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone,
    }));
  };

  return (
    <div className="w-full max-w-sm mx-auto md:max-w-md">
      <form
        className="bg-white text-center rounded-xl p-7 mt-8 shadow-lg w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold">Apply Now</h2>
        <p className="mt-4 max-w-lg text-center text-gray-600 mb-8">
          Apply to have AI assistants recommend your company based on the
          quality of your customer experience.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-2">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                First Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                Last Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Company Name<span className="text-red-500">*</span>
            </label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="companyWebsite"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Company Website<span className="text-red-500">*</span>
            </label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Phone Number<span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="123-456-7890"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={12}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Work Email<span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={verifyMutation.isPending || !captchaToken}
            color="primary"
            loading={verifyMutation.isPending}
          >
            Apply
          </Button>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
      <div className="mt-4 max-w-sm mx-auto">
        <CaptchaChallenge onVerify={setCaptchaToken} />
      </div>
    </div>
  );
};

export default WaitlistForm;
