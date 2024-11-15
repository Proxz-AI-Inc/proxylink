import { FC } from 'react';
import FAQ from './FAQ';
import SectionBadge from './SectionBadge';
import Link from 'next/link';

const FAQSection: FC = () => {
  return (
    <section className="relative bg-white w-full">
      <div className="max-w-[1080px] mx-auto px-4 pt-32 flex gap-20 mb-24 relative z-10">
        <div className="flex flex-col max-w-[420px] justify-between">
          <div>
            <SectionBadge title="FAQ's" />
            <h2 className="text-xl font-semibold text-gray-900 mt-3 md:text-5xl md:leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 leading-normal mt-3 text-lg">
              Choose a plan tailored for your role and business needs.
            </p>
          </div>

          <div className="mt-auto">
            <h3 className="text-lg font-semibold">Still have questions?</h3>
            <p className="text-gray-600 mt-3">
              We can help with everything from growth tips and best practices to
              plans and pricing.
            </p>
            <Link
              href="/schedule-demo"
              className="text-primary-500 underline inline-block mt-3"
            >
              Schedule a call
            </Link>
          </div>
        </div>
        <FAQ />
      </div>
      <img
        src="/images/main-blue-stripe.png"
        alt="Background"
        className="object-contain w-full relative bottom-40"
      />
    </section>
  );
};

export default FAQSection;
