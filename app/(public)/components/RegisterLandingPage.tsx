'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Gift, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import CaptchaChallenge from './CaptchaChallenge';
import { InfoTooltip } from '@/components/ui/tooltip';
import { sendRegisterFormEmail } from '@/lib/email/templates/RegisterFormTemplate';
import { parseErrorMessage } from '@/utils/general';

const TASKS = [
  { field: 'answer_questions', display: 'Answer Account-Specific Questions' },
  {
    field: 'manage_subscriptions',
    display: 'Manage Subscriptions',
    subdisplay: 'Initiate, pause, resume, and cancel subscriptions',
    tooltip:
      'FTC regulations require companies to allow customers to cancel subscriptions through the same method they initiated them. Therefore, if you allow AI assistants to discover and initiate a subscription, then you must also allow AI assistants to pause and cancel subscriptions.',
  },
  { field: 'update_billing', display: 'Update Billing Information' },
  { field: 'request_order_changes', display: 'Request Order Changes' },
  { field: 'track_shipping', display: 'Track Shipping' },
  { field: 'update_shipping', display: 'Update Shipping Address' },
];

type CaptchaVerifyRes = {
  success: boolean;
  error?: string;
};

const FormSubmittedMessage = () => {
  return (
    <div className="text-center rounded-xl p-7 mt-8 bg-green-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Thank you for registering!
      </h2>
      <p className="text-gray-600">
        We received your request and will contact you shortly.
      </p>
    </div>
  );
};

const RegisterLandingPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(
    TASKS.map(task => task.field),
  );
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

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
    onSuccess: () => {
      const selectedTasksDisplay = selectedTasks.map(
        task => TASKS.find(t => t.field === task)?.display || '',
      );
      sendRegisterFormEmail({
        email: email,
        tasks: selectedTasksDisplay,
      });
      setFormSubmitted(true);
    },
    onError: error => {
      setError(parseErrorMessage(error));
    },
  });

  const handleCheckboxChange = (field: string) => {
    if (selectedTasks.includes(field)) {
      setSelectedTasks(selectedTasks.filter(f => f !== field));
    } else {
      setSelectedTasks([...selectedTasks, field]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    verifyMutation.mutate(captchaToken);
  };

  return (
    <div className="w-full md:max-w-[1080px] mx-auto flex flex-col items-center justify-center p-4 py-24">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Join the Marketplace
          <br />
          <span className="whitespace-nowrap">driven by</span>
          <br />
          <span className="text-primary-500 whitespace-nowrap">
            Consumer AI Assistants
          </span>
        </h1>
        <h2 className="text-xl mt-4 max-w-xl text-gray-600">
          Enable Consumer AI Assistants to Provide Magical Customer Experiences
          — Start in Under 3 Minutes
        </h2>
      </div>

      {/* Intro Paragraph */}
      <div className="mt-24 max-w-4xl flex flex-col md:flex-row items-center gap-8">
        <Image
          src="/images/proxylink-ai-assistants.png"
          width={1693}
          height={2313}
          alt="Marketplace Hero Image"
          className="w-full md:w-1/2"
        />
        <p className="text-gray-600 md:leading-loose text-base md:text-lg">
          The future of search isn’t just about being found by humans—it’s about
          being discovered by their AI assistants.
          <br />
          <br />
          By registering with ProxyLink, you’ll be prepared for reputable AI
          assistants to recommend your offerings, assist your customers, and
          streamline their entire experience with your brand.
        </p>
      </div>

      {/* Why It Matters Section */}
      <div className="mt-24 flex flex-col md:flex-row justify-center gap-10">
        <div className="flex flex-col gap-4 items-center text-center basis-1/3">
          <div className="w-12 h-12 text-white rounded-full bg-primary-500 flex items-center justify-center font-semibold">
            <Search className="text-xl" />
          </div>
          <h3 className="font-semibold text-xl text-primary-500">
            AI Search Is Growing
          </h3>
          <p className="text-gray-600">
            With AI assistants increasing in popularity, early adopters who
            welcome these tools stand to gain a competitive edge.
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center text-center basis-1/3">
          <div className="w-12 h-12 text-white rounded-full bg-primary-500 flex items-center justify-center font-semibold">
            <Gift className="text-xl" />
          </div>
          <h3 className="font-semibold text-xl text-primary-500">
            Deliver a Seamless Experience
          </h3>
          <p className="text-gray-600">
            Customers love convenience. Make it easy for their AI assistants to
            manage subscriptions, track orders, and even answer account-specific
            questions on their behalf.
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center text-center basis-1/3">
          <div className="w-12 h-12 text-white rounded-full bg-primary-500 flex items-center justify-center font-semibold">
            <Shield className="text-xl" />
          </div>
          <h3 className="font-semibold text-xl text-primary-500">
            Build Consumer Trust
          </h3>
          <p className="text-gray-600">
            ProxyLink verifies that each AI assistant is authorized to act on
            behalf of your customers, so you can confidently interact with
            consumer AI assistants without compromising on security.
          </p>
        </div>
      </div>

      {/* What Is ProxyLink Section */}
      <div className="mt-24 flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-center text-gray-900">
          What Is ProxyLink?
        </h2>
        <p className="mt-4 max-w-lg text-center text-gray-600">
          ProxyLink is a trusted intermediary that confirms AI assistants are
          legitimate and operating with genuine customer authority. By
          registering on ProxyLink, you build a channel for seamless, verified
          interactions between your brand and your customers’ AI tools.
        </p>

        {/* Registration Form */}
        {formSubmitted ? (
          <FormSubmittedMessage />
        ) : (
          <>
            <form
              className="bg-white text-center rounded-xl p-7 mt-8 shadow-lg"
              onSubmit={handleSubmit}
            >
              <h2 className="text-xl font-semibold">Join the Waitlist</h2>
              <p className="mt-4 max-w-lg text-center text-gray-600 mb-8">
                Be among the first 1,000 companies to have AI assistants
                recommend your company based on the quality of your customer
                experience.
              </p>
              {/* Permitted Tasks */}
              <div className="flex flex-col gap-4">
                {TASKS.map(task => (
                  <div key={task.field} className="flex items-center gap-2">
                    <label key={task.field} className="inline-flex items-start">
                      <input
                        type="checkbox"
                        className="relative top-1 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={task.field}
                        checked={selectedTasks.includes(task.field)}
                        onChange={() => handleCheckboxChange(task.field)}
                      />
                      <div className="flex flex-col items-start ml-2">
                        <div className="flex items-center gap-2">
                          <span>{task.display}</span>
                          {task.tooltip && <InfoTooltip text={task.tooltip} />}
                        </div>
                        {task.subdisplay && (
                          <span className="text-sm text-gray-400">
                            {task.subdisplay}
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {/* Email Address */}
              <div className="flex items-center gap-2 w-full mt-8">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="p-2 border flex-1 rounded-lg h-9 placeholder:text-sm"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={verifyMutation.isPending}
                  color="primary"
                  loading={verifyMutation.isPending}
                >
                  Submit
                </Button>
              </div>
              {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
            <div className="mt-4">
              <CaptchaChallenge onVerify={setCaptchaToken} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterLandingPage;
