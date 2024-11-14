import { Button } from '@/components/ui/button';
import { FC } from 'react';

const ProxiesPricing: FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Free Tier for Proxies */}
      <div className="flex border rounded-2xl h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-64 border-r border-gray-200">
          <img src="/images/pricing-proxy-free-icon.svg" alt="Free Tier" />
          <h3 className="text-xl font-semibold">Free Tier for Proxies</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 py-7">
          <p className="text-gray-500">
            For proxies needing to manually upload transactions in CSV format,
            at no cost.
          </p>
        </div>
        <div className="flex flex-col bg-white px-4 py-6 rounded-r-2xl border-l-1 w-[222px] border-black h-full">
          <div className="text-xl font-semibold flex-1">Free</div>
          <Button outline className="w-fit">
            Get Started
          </Button>
        </div>
      </div>

      {/* Low Volume Package */}
      <div className="flex border rounded-2xl h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-64 border-r border-gray-200">
          <img src="/images/pricing-proxy-low-icon.svg" alt="Low Volume" />
          <h3 className="text-xl font-semibold">Low Volume Package</h3>
        </div>
        <div className="flex items-start gap-2 flex-1 px-4 py-7">
          <p className="text-gray-500">
            Best for small businesses or individuals testing the platform.
          </p>
        </div>
        <div className="flex flex-col bg-white px-4 py-6 rounded-r-2xl border-l-1 w-[222px] border-purple-600 h-full">
          <div className="flex-1">
            <h4 className="text-xl font-semibold">$10.00</h4>
            <p className="text-gray-500">100 API credits</p>
          </div>
          <Button color="primary" className="w-fit">
            Get Started
          </Button>
        </div>
      </div>

      {/* Mid Volume Package */}
      <div className="flex border rounded-2xl h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-64 border-r border-gray-200">
          <img src="/images/pricing-proxy-mid-icon.svg" alt="Mid Volume" />
          <h3 className="text-xl font-semibold">Mid Volume Package</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 py-7">
          <p className="text-gray-500">Best for growing businesses.</p>
        </div>
        <div className="flex flex-col  bg-white px-4 py-6 rounded-r-2xl border-l-1 w-[222px] border-yellow-500 h-full">
          <div className="flex-1">
            <h4 className="text-xl font-semibold">$70.00</h4>
            <p className="text-gray-500">1,000 API credits</p>
          </div>
          <Button color="yellow" className="w-fit">
            Get Started
          </Button>
        </div>
      </div>

      {/* High Volume Package */}
      <div className="flex border rounded-2xl h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-64 border-r border-gray-200">
          <img src="/images/pricing-proxy-high-icon.svg" alt="High Volume" />
          <h3 className="text-xl font-semibold">High Volume Package</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 py-7">
          <p className="text-gray-500">
            Perfect for large businesses with frequent transactions.
          </p>
        </div>
        <div className="flex flex-col  bg-white px-4 py-6 rounded-r-2xl border-l-1 w-[222px] border-green-500 h-full">
          <div className="flex-1">
            <h4 className="text-xl font-semibold">$500.00</h4>
            <p className="text-gray-500">10,000 API credits</p>
          </div>
          <Button color="green" className="w-fit">
            Get Started
          </Button>
        </div>
      </div>

      {/* Enterprise Package */}
      <div className="flex border rounded-2xl h-[156px]">
        <div className="flex flex-col items-start gap-2 p-4 w-64 border-r border-gray-200">
          <img src="/images/pricing-proxy-call-icon.svg" alt="Enterprise" />
          <h3 className="text-xl font-semibold">Enterprise Package</h3>
        </div>
        <div className="flex items-start gap-4 flex-1 px-4 py-7">
          <p className="text-gray-500">Custom credits - Custom Pricing</p>
        </div>
        <div className="flex flex-col bg-white px-4 py-6 rounded-r-2xl border-l-1 w-[222px] border-blue-500 h-full">
          <p className="flex-1 text-sm text-gray-500">
            Contact us for tailored solutions for enterprise-level needs.
          </p>
          <Button color="sky" className="w-fit">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProxiesPricing;
