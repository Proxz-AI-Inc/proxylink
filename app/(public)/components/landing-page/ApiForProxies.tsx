import SectionBadge from './SectionBadge';
import CodeWidget from './CodeWidget';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ApiForProxies = () => {
  return (
    <div className="relative py-8 mt-12 md:pt-64 md:my-32 md:pb-32 bg-transparent">
      {/* Background with adjusted positioning */}
      <div className="absolute inset-0 w-full -mt-32 md:mt-0">
        <img
          src="/images/proxy-api-background.svg"
          alt="Background"
          className="absolute w-full h-full"
        />
      </div>

      {/* Content container */}
      <div className="w-full p-6 md:p-0 md:max-w-[1080px] mx-auto flex flex-col md:flex-row justify-between z-10 relative min-h-[600px]">
        {/* Left content */}
        <div className="max-w-[420px] pt-40 md:pt-0">
          <div className="mb-4">
            <SectionBadge title="PROXY" />
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            An API for Proxies to Streamline Their Operation
          </h2>
          <p className="text-gray-400 mb-8">
            Use the ProxyLink API to automate cancellation requests and save
            offers.
          </p>
          <Link href="/schedule-demo">
            <Button color="primary">Request Access</Button>
          </Link>
        </div>

        {/* Code widget with fixed dimensions */}
        <CodeWidget />
      </div>
    </div>
  );
};

export default ApiForProxies;
