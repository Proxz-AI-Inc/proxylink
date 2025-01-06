'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Gift, Shield } from 'lucide-react';
import WaitlistForm from './WaitlistForm';

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

  return (
    <div className="w-full md:max-w-[1080px] mx-auto flex flex-col items-center justify-center p-4 py-24">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Be Discovered
          <br />
          <span className="whitespace-nowrap">Based on</span>
          <br />
          <span className="text-primary-500 whitespace-nowrap">
            Exceptional Service
          </span>
        </h1>
        <h2 className="text-xl mt-4 max-w-xl text-gray-600">
          Apply to be one of 1,000 companies recommended by consumer AI
          Assistants.
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
          ProxyLink helps consumer AI assistants do real-world tasks. We&apos;re
          launching a tool to improve how AI assistants help people shop. The
          tool with guide AI assistants to brands that provide exceptional
          customer experience.
          <br />
          <br />
          We&apos;re selecting the first 1,000 companies to feature on the
          platform. AI assistants will recommend these companies at no cost. In
          exchange, the only thing these companies bring to the table is a
          commitment to excellent customer service.
        </p>
      </div>

      {/* Why It Matters Section */}
      <div className="mt-24 flex flex-col md:flex-row justify-center gap-10">
        <div className="flex flex-col gap-4 items-center text-center basis-1/3">
          <div className="w-12 h-12 text-white rounded-full bg-primary-500 flex items-center justify-center font-semibold">
            <Search className="text-xl" />
          </div>
          <h3 className="font-semibold text-xl text-primary-500">
            Free Platform
          </h3>
          <p className="text-gray-600">
            Our platform for receiving AI assistant requests is (and will always
            be) free. Only pay for premium features that automate customer
            support for AI assistants.
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center text-center basis-1/3">
          <div className="w-12 h-12 text-white rounded-full bg-primary-500 flex items-center justify-center font-semibold">
            <Gift className="text-xl" />
          </div>
          <h3 className="font-semibold text-xl text-primary-500">
            Leads Based on Quality
          </h3>
          <p className="text-gray-600">
            Receive new customers based on the quality of your service. Break
            your reliance on paid ads, SEO, and social content for new
            customers.
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center text-center basis-1/3">
          <div className="w-12 h-12 text-white rounded-full bg-primary-500 flex items-center justify-center font-semibold">
            <Shield className="text-xl" />
          </div>
          <h3 className="font-semibold text-xl text-primary-500">
            High Security
          </h3>
          <p className="text-gray-600">
            ProxyLink verifies that each AI assistant is authorized to act on
            behalf of your customers, so you don&apos;t have to compromise on
            security.
          </p>
        </div>
      </div>

      {/* What Is ProxyLink Section */}
      <div className="mt-24 flex flex-col items-center">
        {/* Registration Form */}
        {formSubmitted ? (
          <FormSubmittedMessage />
        ) : (
          <WaitlistForm onSubmit={() => setFormSubmitted(true)} />
        )}
      </div>
    </div>
  );
};

export default RegisterLandingPage;
