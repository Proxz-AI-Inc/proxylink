import Link from 'next/link';
import Image from 'next/image';

const Logo = ({ width = 123 }: { width?: number }) => {
  return (
    <Link href="/">
      <Image
        src="/images/Logo.svg"
        width={width}
        height={Math.round((width / 123) * 24)}
        alt="ProxyLink logotype"
        className="mr-11"
      />
    </Link>
  );
};

export default Logo;
