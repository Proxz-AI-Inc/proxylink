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
          <WaitlistForm onSubmit={() => setFormSubmitted(true)} />
        )}
      </div>
    </div>
  );
};

export default RegisterLandingPage;
