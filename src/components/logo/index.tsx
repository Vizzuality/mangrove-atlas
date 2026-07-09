import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  src?: string;
  onClick?: () => void;
  width?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const POSITION_CLASSES: Record<string, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

// Intrinsic dimensions of logo.webp — kept constant so next/image always has
// the correct aspect ratio. Display size is driven by CSS (width prop + height
// auto), which avoids the "width/height modified but not the other" warning
// when responsive rules constrain one dimension.
const INTRINSIC_WIDTH = 186;
const INTRINSIC_HEIGHT = 216;

const Logo = ({
  src = '/images/logo.webp',
  onClick,
  width = INTRINSIC_WIDTH,
  position = 'top-right',
}: LogoProps) => {
  return (
    <Link
      href="/"
      className={`pointer-events-auto fixed z-[800] ${POSITION_CLASSES[position]}`}
      draggable={false}
      data-testid="desktop-logo"
      {...(onClick && { onClick })}
    >
      <Image
        src={src}
        alt="Global Mangrove Watch"
        width={INTRINSIC_WIDTH}
        height={INTRINSIC_HEIGHT}
        priority={true}
        style={{ width, height: 'auto' }}
      />
    </Link>
  );
};

export default Logo;
