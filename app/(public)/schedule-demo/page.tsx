import ContactForm from '../components/ContactForm';
import SectionBadge from '../components/landing-page/SectionBadge';

export default function ScheduleDemoPage() {
  return (
    <div className="flex flex-col md:max-w-[1080px] mx-auto py-12 md:py-16 gap-8 md:gap-12 min-h-[100dvh] md:min-h-screen md:pt-32">
      <div className="w-full flex flex-col items-center justify-center">
        <SectionBadge title="Contact Us" />
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 bg-landing text-center">
          Schedule a demo
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
          Let us know how we can help
        </p>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-4 p-4 md:p-0">
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 md:p-7 md:self-start">
          <h1 className="text-xl md:text-2xl mb-2 font-semibold">
            See ProxyLink in Action
          </h1>
          <p className="text-sm text-gray-500">
            Take full advantage of ProxyLink&apos;s tools for managing 3rd party
            customer support requests.
          </p>
          <div className="w-full mt-4 flex flex-col gap-4">
            <p className="text-lg text-gray-500">
              What to expect in the 30 minute demo:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li className="text-sm text-gray-500">
                A few questions to better understand your needs
              </li>
              <li className="text-sm text-gray-500">Full platform demo</li>
              <li className="text-sm text-gray-500">
                Role playing to show you the true speed of ProxyLink
              </li>
              <li className="text-sm text-gray-500">
                We’ll let you know if you’re not a good fit before the call is
                over
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-lg p-7">
          <h1 className="text-xl md:text-2xl mb-2 font-semibold">
            Fill out the form to request a demo
          </h1>
          <span className="text-sm text-gray-500">
            We will get back to you as soon as possible.
          </span>
          <div className="mt-4">
            <ContactForm type="demo" />
          </div>
        </div>
      </div>
    </div>
  );
}
