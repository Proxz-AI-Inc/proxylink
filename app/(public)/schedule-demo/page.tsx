import ContactForm from '../components/ContactForm';
import SectionBadge from '../components/landing-page/SectionBadge';

export default function ScheduleDemoPage() {
  return (
    <div className="flex flex-col md:max-w-[1080px] mx-auto py-8 md:py-16 gap-12 min-h-[100dvh] md:min-h-screen md:pt-32">
      <div className="w-full flex flex-col items-center justify-center">
        <SectionBadge title="Contact Us" />
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 bg-landing text-center">
          Contact Our Team
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
          Let us know how we can help
        </p>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-full md:w-1/2 bg-white rounded-lg p-7">
          <h1 className="text-xl md:text-2xl mb-2 font-semibold">
            Schedule a Demo
          </h1>
          <span className="text-sm text-gray-500">
            Take full advantage of ProxyLink&apos;s tools for managing 3rd party
            customer support requests.
          </span>
          <p className="mb-12"></p>
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2Xy1-GkJaBCN8TCqZ48S2uR8q-LkngfDtmkUwwDCJ3U7HP0j86WRRTl0vIM4f5YjN2xnX1oZ9S?gv=true"
            style={{ border: 0, marginBottom: '100px' }}
            width="100%"
            height="600"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-lg p-7">
          <h1 className="text-xl md:text-2xl mb-2 font-semibold">Contact Us</h1>
          <span className="text-sm text-gray-500">
            Let us know how we can help
          </span>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
