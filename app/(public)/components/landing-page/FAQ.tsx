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
      question: 'What are proxies?',
      answer:
        'Consumers are increasingly delegating customer support tasks to third parties. These third parties are called "proxies." These proxies are contacting customer support departments through a variety of methods (phone calls, chats, emails). CX teams are often unaware they are communicating with a proxy.',
      defaultOpen: true,
    },
    {
      question: 'Are CX teams obligated to deal with proxies?',
      answer:
        'Proxies have your customers enter into agency agreements. Under these agreements, your customer becomes a "principal" under agency law. And their proxy becomes their "agent." Therefore, proxies are bestowed with the same legal rights and privileges held by customers when dealing with your company.',
    },
    {
      question: 'Do CX teams have rights when regulating proxy activity?',
      answer:
        'Yes. CX teams can control how customers and their proxies communicate with them. However, CX teams must ensure that restrictions on consumer (and proxy) communication comply with state and federal consumer protection laws. ProxyLink is designed to give CX teams maximum control while maintaining legal compliance.',
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
