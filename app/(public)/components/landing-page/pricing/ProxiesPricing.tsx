import { Button } from '@/components/ui/button';
import { FC } from 'react';

const ProxiesPricing: FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Free Tier for Proxies */}
      <div className="flex flex-col md:flex-row border rounded-2xl md:h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-full md:w-64 md:border-r border-gray-200">
          <img src="/images/pricing-proxy-free-icon.svg" alt="Free Tier" />
          <h3 className="text-xl font-semibold">Free Tier for Proxies</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 pb-4 md:py-7">
          <p className="text-gray-500">
            For proxies needing to manually upload transactions in CSV format,
            at no cost.
          </p>
        </div>
        <div className="flex items-center md:flex-col bg-white px-4 py-6 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl border-t md:border-t-0 md:border-l w-full md:w-[222px] border-black h-full">
          <div className="text-xl font-semibold flex-1">Free</div>
          <Button outline>Get Started</Button>
        </div>
      </div>

      {/* Low Volume Package */}
      <div className="flex flex-col md:flex-row border rounded-2xl md:h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-full md:w-64 md:border-r border-gray-200">
          <img src="/images/pricing-proxy-low-icon.svg" alt="Low Volume" />
          <h3 className="text-xl font-semibold">Low Volume Package</h3>
        </div>
        <div className="flex items-start gap-2 flex-1 px-4 pb-4 md:py-7">
          <p className="text-gray-500">
            Best for small businesses or individuals testing the platform.
          </p>
        </div>
        <div className="flex items-center md:flex-col bg-white px-4 py-6 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl border-t md:border-t-0 md:border-l w-full md:w-[222px] border-purple-600 h-full">
          <div className="flex-1">
            <h4 className="text-xl font-semibold">$10.00</h4>
            <p className="text-gray-500">100 API credits</p>
          </div>
          <Button
            color="primary"
            className="border-none text-white bg-[#534CFB] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(180deg,rgba(255,255,255,0.1)_46%,rgba(255,255,255,0)_54%)] shadow-[0px_0px_0px_1px_#6C47FF,0px_1px_0px_0px_rgba(255,255,255,0.07)_inset,0px_1px_3px_0px_rgba(33,33,38,0.20)]"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Mid Volume Package */}
      <div className="flex flex-col md:flex-row border rounded-2xl md:h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-full md:w-64 md:border-r border-gray-200">
          <img src="/images/pricing-proxy-mid-icon.svg" alt="Mid Volume" />
          <h3 className="text-xl font-semibold">Mid Volume Package</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 pb-4 md:py-7">
          <p className="text-gray-500">Best for growing businesses.</p>
        </div>
        <div className="flex items-center md:flex-col bg-white px-4 py-6 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl border-t md:border-t-0 md:border-l w-full md:w-[222px] border-yellow-500 h-full">
          <div className="flex-1">
            <h4 className="text-xl font-semibold">$70.00</h4>
            <p className="text-gray-500">1,000 API credits</p>
          </div>
          <Button
            color="yellow"
            className="w-fit border-none bg-[#FFCB00] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(180deg,rgba(255,255,255,0.15)_46%,rgba(255,255,255,0)_54%)] shadow-[0px_0px_0px_1px_#FFCB00,0px_1px_0px_0px_rgba(255,255,255,0.07)_inset,0px_1px_3px_0px_rgba(33,33,38,0.20)]"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* High Volume Package */}
      <div className="flex flex-col md:flex-row border rounded-2xl md:h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-full md:w-64 md:border-r border-gray-200">
          <img src="/images/pricing-proxy-high-icon.svg" alt="High Volume" />
          <h3 className="text-xl font-semibold">High Volume Package</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 pb-4 md:py-7">
          <p className="text-gray-500">
            Perfect for large businesses with frequent transactions.
          </p>
        </div>
        <div className="flex items-center md:flex-col bg-white px-4 py-6 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl border-t md:border-t-0 md:border-l w-full md:w-[222px] border-green-500 h-full">
          <div className="flex-1">
            <h4 className="text-xl font-semibold">$500.00</h4>
            <p className="text-gray-500">10,000 API credits</p>
          </div>
          <Button className="w-fit border-none bg-[#42D0A1] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(180deg,rgba(255,255,255,0.15)_46%,rgba(255,255,255,0)_54%)] shadow-[0px_0px_0px_1px_#42D0A1,0px_1px_0px_0px_rgba(255,255,255,0.07)_inset,0px_1px_3px_0px_rgba(33,33,38,0.20)] rounded-[6px] text-white">
            Get Started
          </Button>
        </div>
      </div>

      {/* Enterprise Package */}
      <div className="flex flex-col md:flex-row border rounded-2xl md:h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-full md:w-64 md:border-r border-gray-200">
          <img src="/images/pricing-proxy-call-icon.svg" alt="Enterprise" />
          <h3 className="text-xl font-semibold">Enterprise Package</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 pb-4 md:py-7">
          <p className="text-gray-500">Custom credits - Custom Pricing</p>
        </div>
        <div className="flex items-center md:flex-col bg-white px-4 py-6 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl border-t md:border-t-0 md:border-l w-full md:w-[222px] border-blue-500 h-full">
          <p className="flex-1 text-sm text-gray-500">
            Contact us for tailored solutions for enterprise-level needs.
          </p>
          <Button className="w-fit border-none bg-[#118EFF] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(180deg,rgba(255,255,255,0.1)_46%,rgba(255,255,255,0)_54%)] shadow-[0px_0px_0px_1px_#118EFF,0px_1px_0px_0px_rgba(255,255,255,0.07)_inset,0px_1px_3px_0px_rgba(33,33,38,0.20)] rounded-[6px] text-white">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProxiesPricing;
