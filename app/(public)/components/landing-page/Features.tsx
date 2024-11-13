import SectionBadge from './SectionBadge';
import Image from 'next/image';

const Features = () => {
  return (
    <div className="max-w-[1080px] mx-auto relative">
      <SectionBadge title="Features" />
      <div className="w-full absolute flex flex-row items-center justify-between">
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
    </div>
  );
};

export default Features;
