import { FC } from 'react';
import FAQ from './FAQ';
import SectionBadge from './SectionBadge';
import Link from 'next/link';

const FAQSection: FC = () => {
  return (
    <>
      <section className="relative bg-white w-full pb-20">
        <div className="max-w-[1080px] mx-auto px-4 pt-32 flex gap-20 mb-24 relative z-10">
          <div className="flex flex-col max-w-[420px] w-full justify-between">
            <div>
              <SectionBadge title="FAQ's" />
              <h2 className="text-xl font-semibold text-gray-900 mt-3 md:text-5xl md:leading-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-auto">
              <h3 className="text-lg font-semibold">Still have questions?</h3>
              <p className="text-gray-600 mt-3">
                We can help with everything from growth tips and best practices
                to plans and pricing.
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

        <div className="absolute bottom-[-280px] w-full overflow-hidden">
          <div
            className="w-full relative"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              height: '500px', // Adjust height as needed
            }}
          >
            <img
              src="/images/main-blue-stripe.png"
              alt="Background"
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center top',
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
