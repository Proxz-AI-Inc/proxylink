import SectionBadge from './SectionBadge';
import CodeWidget from './CodeWidget';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ApiForProxies = () => {
  return (
    <div className="relative pt-64 my-32 pb-32">
      {/* Background Image */}
      <Image
        src="/images/proxy-api-background.svg"
        alt="Background"
        fill
        className="absolute inset-0 object-cover z-0"
        priority
      />

      <div className="max-w-[1080px] mx-auto flex flex-row justify-between z-10 relative">
        {/* Left content */}
        <div className="max-w-[420px]">
          <div className="mb-4">
            <SectionBadge title="PROXY" />
          </div>
          <h2 className="text-5xl font-semibold text-white mb-4">
            An API for Proxies to streamline their operation.
          </h2>
          <p className="text-gray-400 mb-8">
            Use the ProxyLink API to automate cancellation requests and save
            offers.
          </p>
          <Button color="primary">Request Access</Button>
        </div>

        {/* Code widget */}
        <CodeWidget />
      </div>
    </div>
  );
};

export default ApiForProxies;
