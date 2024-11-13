import SectionBadge from './SectionBadge';
import Image from 'next/image';

const Features = () => {
  return (
    <div className="max-w-[1080px] mx-auto relative flex flex-col items-center justify-center mt-96">
      <SectionBadge title="Features" />
      <div className="w-full absolute flex flex-row items-center justify-between z-[-1] top-12">
        <Image
          src="/images/features-border-1.svg"
          width={517}
          height={578}
          alt="Features border"
        />
        <Image
          src="/images/features-border-2.svg"
          width={517}
          height={578}
          alt="Features border"
        />
      </div>
      <h2 className="text-5xl font-semibold text-gray-900 mt-3">
        Without ProxyLink
      </h2>
      <p className="text-base text-gray-500 mt-3 max-w-prose">
        Third-party cancellations are costly, burdensome, and high-risk.
      </p>
      <Image
        src="/images/features-slide-1-without-proxylink.svg"
        width={1080}
        height={401}
        alt="Proxy Customers without ProxyLink"
      />
    </div>
  );
};

export default Features;
