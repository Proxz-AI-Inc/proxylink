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
            <span className="text-xs">Proxy identity unknown</span>
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
          <span className="text-xs">Customer consent unverified</span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <div className="min-w-5 h-5">
            <img
              src="/images/warning-icon.svg"
              alt="Alert Triangle"
              className="w-full h-full"
            />
          </div>
          <span className="text-xs">Expensive to handle</span>
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
          <span className="text-xs">Enhanced security</span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">Verification of proxy identity</span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">
            FTC compliance for subscription cancellations
          </span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">Increased efficiency and order</span>
        </div>
      </div>
    </>
  );
}

export function SaveOffersInfo() {
  return (
    <>
      <h3 className="text-sm font-semibold mb-3 md:mb-6">With ProxyLink</h3>
      <div className="space-y-2 md:space-y-4">
        <div className="flex gap-2 md:gap-3 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">Increasing retention</span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">Create custom save offers</span>
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
            Integrates directly with your payment processor.
          </span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">
            Optimize save offers through A/B testing.
          </span>
        </div>
        <div className="flex gap-2 md:gap-3 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">
            100% Automate save offers and the full resolution of the request.
          </span>
        </div>
      </div>
    </>
  );
}
