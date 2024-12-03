import { Check, Plus } from 'lucide-react';

export function DisabledInfo() {
  return (
    <div className="flex items-center flex-wrap gap-1 md:flex-col md:gap-4 justify-center md:items-start">
      <div className="flex gap-2 md:gap-3 items-center">
        <div className="flex gap-1 md:gap-2 items-center">
          <div className="min-w-6 h-6">
            <img
              src="/images/warning-icon.svg"
              alt="Alert Triangle"
              className="w-full h-full"
            />
          </div>
          <span className="text-xs">Proxy Unknown</span>
        </div>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="min-w-6 h-6">
          <img
            src="/images/warning-icon.svg"
            alt="Alert Triangle"
            className="w-full h-full"
          />
        </div>
        <span className="text-xs">Customer Unverified</span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="min-w-6 h-6">
          <img
            src="/images/warning-icon.svg"
            alt="Alert Triangle"
            className="w-full h-full"
          />
        </div>
        <span className="text-xs">Expensive</span>
      </div>
    </div>
  );
}

export function EnabledInfo() {
  return (
    <div className="flex items-center flex-wrap gap-1 md:flex-col md:gap-4 justify-center md:items-start">
      <div className="flex gap-2 md:gap-3 items-center">
        <div className="flex gap-1 md:gap-2 items-center">
          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <span className="text-xs">Verified Proxy</span>
        </div>
      </div>
      <div className="flex gap-2 md:gap-3 items-center">
        <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
        <span className="text-xs">FTC Compliant</span>
      </div>
      <div className="flex gap-2 md:gap-3 items-center">
        <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
        <span className="text-xs">Efficient</span>
      </div>
    </div>
  );
}

export function AutomateInfo() {
  return (
    <div className="flex items-center flex-wrap gap-1 md:flex-col md:gap-4 justify-center md:items-start">
      <div className="flex gap-2 md:gap-3 items-center">
        <div className="flex gap-1 md:gap-2 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">CRM Integration</span>
        </div>
      </div>
      <div className="flex gap-2 md:gap-3 items-center">
        <div className="flex gap-1 md:gap-2 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">A/B Testing</span>
        </div>
      </div>
      <div className="flex gap-2 md:gap-3 items-center">
        <div className="flex gap-1 md:gap-2 items-center">
          <Plus className="h-5 w-5 flex-shrink-0 text-[#42D0A1]" />
          <span className="text-xs">100% Automation</span>
        </div>
      </div>
    </div>
  );
}
