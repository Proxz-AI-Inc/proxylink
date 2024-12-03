import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  return (
    <div className="flex flex-col md:max-w-[1080px] mx-auto p-6 py-24 md:py-16 gap-8 md:gap-12 min-h-[100dvh] md:min-h-screen md:pt-32">
      <div className="w-full flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 bg-landing text-center">
          Contact Our Team
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
          Let us know how we can help
        </p>
      </div>
      <div className="w-full flex justify-center gap-4">
        <div className="w-full md:w-1/2 bg-white rounded-lg p-7">
          <h1 className="text-xl md:text-2xl mb-2 font-semibold">Contact Us</h1>
          <span className="text-sm text-gray-500">
            Let us know how we can help
          </span>
          <div className="mt-4">
            <ContactForm type="contact" />
          </div>
        </div>
      </div>
    </div>
  );
}
