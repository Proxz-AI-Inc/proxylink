'use client';

import { FC } from 'react';

interface PricingToggleProps {
  activeType: 'providers' | 'proxies';
  onToggle: (type: 'providers' | 'proxies') => void;
}

const PricingToggle: FC<PricingToggleProps> = ({ activeType, onToggle }) => {
  return (
    <div className="flex flex-col items-center w-fit md:flex-row md:justify-center">
      <button
        onClick={() => onToggle('providers')}
        className={`flex items-center gap-2 px-4 py-2 rounded-l-full w-full shadow-pricingToggle md:w-auto ${
          activeType === 'providers' ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        <img
          src="/images/pricing-providers-icon.svg"
          alt=""
          className="w-5 h-5"
        />
        <span className="text-gray-900">For Providers</span>
      </button>
      <button
        onClick={() => onToggle('proxies')}
        className={`flex items-center gap-2 px-4 py-2 rounded-r-full w-full shadow-pricingToggle md:w-auto ${
          activeType === 'proxies' ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        <img src="/images/pricing-proxy-icon.svg" alt="" className="w-5 h-5" />
        <span className="text-gray-900">For Proxies</span>
      </button>
    </div>
  );
};

export default PricingToggle;
