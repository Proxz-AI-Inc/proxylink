import Link from 'next/link';
import Image from 'next/image';

const Logo = ({
  width = 123,
  className,
}: {
  width?: number;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Link href="/">
        <Image
          src="/images/Logo.svg"
          width={width}
          height={Math.round((width / 123) * 24)}
          alt="ProxyLink logotype"
        />
      </Link>
    </div>
  );
};

export default Logo;
