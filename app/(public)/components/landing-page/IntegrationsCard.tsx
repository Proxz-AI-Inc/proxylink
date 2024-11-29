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
        'relative bg-white rounded-[20px] md:rounded-[32px] p-4 md:p-6 shadow-card w-full md:max-w-[265px] md:w-full flex flex-col',
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
      <div className="relative">
        <div
          className="flex justify-center mx-auto w-[120px] h-[40px]"
          style={{
            background: 'url(/images/integrations-button.svg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <span className="flex items-center h-full text-gray-900 font-medium text-xs md:text-sm leading-normal">
            {title}
          </span>
        </div>
      </div>

      {/* Features list - align to top */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4 mt-6 md:mt-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-1 md:gap-2">
            <div className="mt-1 w-4 h-4 flex-shrink-0 flex-grow-0">
              <Check className="text-[#20C997] w-full h-full" />
            </div>
            <span className="text-gray-600 text-xs md:text-base leading-relaxed">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsCard;
