import ProxyLinkSwitches from './ProxyLinkSwitches';
import SectionBadge from './SectionBadge';
import Image from 'next/image';

const Features = () => {
  return (
    <div className="max-w-[1080px] mx-auto relative flex flex-col items-center justify-center mt-96">
      <SectionBadge title="Features" />
      <div className="w-full absolute flex flex-row items-center justify-between z-[1] top-[52px]">
        <Image
          src="/images/features-border.svg"
          width={1034}
          height={580}
          alt="Features border"
        />
      </div>
      <h2 className="text-5xl font-semibold text-gray-900 mt-2 bg-landing">
        Without ProxyLink
      </h2>
      <p className="text-base text-gray-500 mt-3 max-w-prose text-center">
        Third-party cancellations are costly, burdensome, and high-risk.
      </p>
      <Image
        src="/images/features-slide-1-without-proxylink.svg"
        width={1080}
        height={401}
        alt="Proxy Customers without ProxyLink"
      />
      <p className="text-base text-gray-500 max-w-prose text-center">
        Customers are delegating the task of subscription cancellation to third
        parties (a.k.a. &quot;Proxies&quot;). These proxies are processing these
        cancellations in bulk through traditional customer support channels.
      </p>
      <ProxyLinkSwitches />
    </div>
  );
};

export default Features;
