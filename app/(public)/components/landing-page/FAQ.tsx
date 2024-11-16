import { FC } from 'react';
import { Disclosure, DisclosureButton } from '@headlessui/react';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

const FAQItem: FC<FAQItemProps> = ({
  question,
  answer,
  defaultOpen = false,
}) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="flex flex-col shadow-disclosure rounded-lg overflow-hidden">
          <DisclosureButton className="flex justify-between w-full px-4 md:px-7 py-3 md:py-7 text-sm font-medium text-left text-gray-900 bg-white focus:outline-none">
            <span className="font-semibold">{question}</span>
            {open ? (
              <MinusIcon className="w-5 h-5 text-[#534CFB] transition-transform duration-200" />
            ) : (
              <PlusIcon className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            )}
          </DisclosureButton>

          <div
            className={`transition-all duration-300 ease-in-out ${
              open ? 'max-h-96' : 'max-h-0'
            } overflow-hidden`}
          >
            <div className="p-7 pt-0 text-sm text-gray-500 bg-white">
              {answer}
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
};

const FAQ: FC = () => {
  const faqs = [
    {
      question: 'What is your return policy?',
      answer:
        "Our return policy allows for returns within 30 days of purchase. Items must be unused and in their original packaging with all tags attached. Once we receive your return, we'll process a full refund to your original payment method within 5-7 business days.",
      defaultOpen: true,
    },
    {
      question: 'How do I track my order?',
      answer:
        "Once your order ships, you'll receive a confirmation email with a tracking number. Click the tracking number to see real-time updates on your package's location and estimated delivery date. You can also log into your account to view order status and tracking information.",
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see exact shipping costs during checkout after entering your delivery address. Please note that international orders may be subject to customs fees and import duties.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are securely processed and encrypted to protect your financial information.',
    },
    {
      question: 'How can I contact customer support?',
      answer:
        'Our customer support team is available 24/7 through multiple channels: Email: support@example.com, Phone: 1-800-123-4567, Live Chat on our website, or through our social media channels. We typically respond to all inquiries within 24 hours.',
    },
    {
      question: 'What is your warranty policy?',
      answer:
        'All our products come with a standard one-year warranty that covers manufacturing defects and malfunctions. The warranty does not cover damage from misuse, accidents, or unauthorized modifications. Extended warranty options are available for purchase at checkout.',
    },
  ];

  return (
    <div className="w-full mx-auto flex flex-col gap-4">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          defaultOpen={faq.defaultOpen}
        />
      ))}
    </div>
  );
};

export default FAQ;
