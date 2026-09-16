import Image from 'next/image';
import Link from 'next/link';

import cn from '@/lib/classnames';

type LogoProps = {
  src?: string;
  className?: string;
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

// Intrinsic dimensions per asset. next/image builds its srcset from the
// `width` prop (not the CSS size), so the prop must be the real display width
// or HiDPI screens get an upscaled, blurry candidate. Height is derived from
// the asset's aspect ratio so both props stay consistent with the rendered
// box (display size is still driven by CSS: width + height auto), which
// avoids the "width/height modified but not the other" warning.
const INTRINSIC_SIZES: Record<string, { width: number; height: number }> = {
  '/images/logo.webp': { width: 562, height: 662 },
  '/images/logo-bg.png': { width: 186, height: 216 },
};
const DEFAULT_SRC = '/images/logo.webp';
const DEFAULT_WIDTH = 186;

const Logo = ({
  src = DEFAULT_SRC,
  className,
  onClick,
  width = DEFAULT_WIDTH,
  position = 'top-right',
}: LogoProps) => {
  const intrinsic = INTRINSIC_SIZES[src] ?? INTRINSIC_SIZES[DEFAULT_SRC];
  const height = Math.round((width * intrinsic.height) / intrinsic.width);

  return (
    <Link
      href="/"
      className={cn('pointer-events-auto fixed z-[800]', POSITION_CLASSES[position], className)}
      draggable={false}
      data-testid="desktop-logo"
      {...(onClick && { onClick })}
    >
      <Image
        src={src}
        alt="Global Mangrove Watch"
        width={width}
        height={height}
        priority={true}
        style={{ width, height: 'auto' }}
      />
    </Link>
  );
};

export default Logo;
