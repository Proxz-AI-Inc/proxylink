import { Check, Plus } from 'lucide-react';

export function DisabledInfo() {
  return (
    <>
      <h3 className="text-sm font-semibold mb-3 md:mb-6">Without ProxyLink</h3>
      <div className="space-y-2 md:space-y-4">
        <div className="flex gap-2 md:gap-3 items-center">
          <div className="flex gap-2 md:gap-3 items-center">
            <div className="min-w-5 h-5">
              <img
                src="/images/warning-icon.svg"
                alt="Alert Triangle"
                className="w-full h-full"
              />
            </div>
            <span className="text-xs">Proxy Identity Unknown</span>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <div className="min-w-5 h-5">
            <img
              src="/images/warning-icon.svg"
              alt="Alert Triangle"
              className="w-full h-full"
            />
          </div>
          <span className="text-xs">Customer Consent Unverified</span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <div className="min-w-5 h-5">
            <img
              src="/images/warning-icon.svg"
              alt="Alert Triangle"
              className="w-full h-full"
            />
          </div>
          <span className="text-xs">Expensive to Handle</span>
        </div>
      </div>
    </>
  );
}

export function EnabledInfo() {
  return (
    <>
      <h3 className="text-sm font-semibold mb-3 md:mb-6">With ProxyLink</h3>
      <div className="space-y-2 md:space-y-4">
        <div className="flex gap-2 md:gap-3 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">Enhanced Security</span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">Verification of Proxy Identity</span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">
            FTC Compliance for Subscription Cancellations
          </span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">Increased Efficiency and Order</span>
        </div>
      </div>
    </>
  );
}

export function AutomateInfo() {
  return (
    <>
      <h3 className="text-sm font-semibold mb-3 md:mb-6">With ProxyLink</h3>
      <div className="space-y-2 md:space-y-4">
        <div className="flex gap-2 md:gap-3 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">
            Integrates Directly with Your Payment Processor.
          </span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">
            Optimize Save Offers through A/B Testing.
          </span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">
            100% Automate Save Offers and the Full Resolution of the Request.
          </span>
        </div>
      </div>
    </>
  );
}
