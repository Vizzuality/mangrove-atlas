import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  src?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const POSITION_CLASSES: Record<string, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

const Logo = ({
  src = '/images/logo.webp',
  onClick,
  width = 186,
  height = 216,
  position = 'top-right',
}: LogoProps) => {
  return (
    <Link
      href="/"
      className={`pointer-events-auto fixed z-[800] ${POSITION_CLASSES[position]}`}
      draggable={false}
      {...(onClick && { onClick })}
    >
      <Image src={src} alt="Global Mangrove Watch" width={width} height={height} priority={true} />
    </Link>
  );
};

export default Logo;
