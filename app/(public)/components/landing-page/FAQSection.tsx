import { FC } from 'react';
import FAQ from './FAQ';
import SectionBadge from './SectionBadge';
import Link from 'next/link';

const HaveQuestions = ({ className = '' }) => {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold">Still have questions?</h3>
      <p className="text-gray-600 mt-3">
        We can help with everything from growth tips and best practices to plans
        and pricing.
      </p>
      <Link
        href="/schedule-demo"
        className="text-primary-500 underline inline-block mt-3"
      >
        Schedule a call
      </Link>
    </div>
  );
};

const FAQSection: FC = () => {
  return (
    <section className="relative bg-white w-full pb-1 md:pb-20">
      <div className="max-w-[1080px] mx-auto p-6 md:px-4 pt-14 md:pt-32 flex flex-col md:flex-row gap-4 md:gap-20 mb-24 relative z-10">
        <div className="flex flex-col max-w-[420px] w-full justify-between">
          <div>
            <SectionBadge title="FAQ's" />
            <h2 className="text-4xl leading-tight font-semibold text-gray-900 mt-3 md:text-5xl md:leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <HaveQuestions className="hidden md:block mt-auto" />
        </div>
        <FAQ />
        <HaveQuestions className="md:hidden mt-4" />
      </div>
    </section>
  );
};

export default FAQSection;
