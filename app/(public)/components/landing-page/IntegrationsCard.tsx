import { Check } from 'lucide-react';
import { cn } from '@/utils/general';

interface IntegrationsCardProps {
  title: string;
  features: string[];
  className?: string;
}

const IntegrationsCard = ({
  title,
  features,
  className,
}: IntegrationsCardProps) => {
  return (
    <div
      className={cn(
        'relative bg-white rounded-[32px] p-8 shadow-card max-w-[265px]',
        className,
      )}
    >
      {/* Top container with background SVG */}
      <div className="absolute top-0 left-0 w-full">
        <img
          src="/images/integrations-card-bg.svg"
          alt=""
          className="w-full"
          aria-hidden="true"
        />
      </div>

      {/* Button with title */}
      <div className="relative flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-button">
          <img
            src="/images/integrations-btn.svg"
            alt=""
            className="w-6 h-6"
            aria-hidden="true"
          />
          <span className="text-gray-900 font-medium">{title}</span>
        </div>
      </div>

      {/* Features list */}
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-1 p-0.5 rounded-full bg-[#E5F6F3]">
              <Check className="w-4 h-4 text-[#20C997]" />
            </div>
            <span className="text-gray-600 leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsCard;
