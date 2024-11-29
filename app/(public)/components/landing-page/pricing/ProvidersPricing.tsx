import { FC } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProvidersPricing: FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full md:flex-row">
      {/* Free Plan */}
      <div className="flex flex-col md:flex-row md:basis-1/2 rounded-[16px] shadow-pricingCard overflow-hidden min-h-[400px]">
        <div className="bg-white p-6 md:p-8 flex-1 flex flex-col">
          <h3 className="text-2xl font-semibold mb-4">Free Plan</h3>
          <div className="space-y-4 flex-1">
            <div className="flex gap-3">
              <Check className="w-5 h-5 min-w-[20px] text-primary-500" />
              <span className="text-gray-600 text-sm leading-normal">
                Verify proxy identify and authority to act on behalf of your
                customers.
              </span>
            </div>
            <div className="flex gap-3">
              <Check className="w-5 h-5 min-w-[20px] text-primary-500" />
              <span className="text-gray-600 text-sm leading-normal">
                Manually handle requests on the ProxyLink Dashboard without
                integrations.
              </span>
            </div>
            <div className="flex gap-3">
              <Check className="w-5 h-5 min-w-[20px] text-primary-500" />
              <span className="text-gray-600">
                Reduce Cancellations Through Custom Save Offers.
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button color="primary">Get Started</Button>
          </div>
        </div>

        <div className="flex flex-col py-8 px-6 md:p-0 items-center justify-center  md:max-w-[168px] w-full bg-gray-50">
          <div className="text-2xl font-semibold">$0/month</div>
          <div className="text-gray-500 text-center mt-3 text-sm leading-normal">
            Access essential tools at no cost.
          </div>
        </div>
      </div>

      {/* Premium Plan */}
      <div className="flex flex-col md:flex-row md:basis-1/2 rounded-[16px] shadow-pricingCard overflow-hidden min-h-[400px]">
        <div className="bg-black p-6 text-white md:p-8 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-2xl font-semibold">Premium Plan</h3>
            <img
              src="/images/pricing-provider-premium-icon.svg"
              alt=""
              className="w-6 h-6"
            />
          </div>
          <div className="space-y-4 flex-1 max-w-[80%]">
            <div className="flex gap-3">
              <Check className="w-5 h-5 min-w-[20px] text-[#20C997]" />
              <span className="text-gray-300">
                Integrate with your payment processor and CRM.
              </span>
            </div>
            <div className="flex gap-3">
              <Check className="w-5 h-5 min-w-[20px] text-[#20C997]" />
              <span className="text-gray-300">
                Optimize save offers through A/B testing.
              </span>
            </div>
            <div className="flex gap-3">
              <Check className="w-5 h-5 min-w-[20px] text-[#20C997]" />
              <span className="text-gray-300">100% automate</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button color="green">Get Started</Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-8 px-6 md:p-0 md:max-w-[168px] w-full bg-gray-800">
          <div className="text-sm text-gray-400 mt-6">Starting at</div>
          <div className="text-2xl font-semibold text-white">$250/month</div>
          <div className="text-gray-400 text-center mt-3 text-sm leading-normal">
            Advanced integrations and automations to streamline your workflow.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPricing;
