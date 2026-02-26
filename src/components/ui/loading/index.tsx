import cn from '@/lib/classnames';
import { IconBaseProps } from 'react-icons/lib/iconBase';
import { LuLoaderCircle } from 'react-icons/lu';

const LuLoaderIcon = LuLoaderCircle as unknown as (p: IconBaseProps) => JSX.Element;

type LoadingProps = {
  visible?: boolean;
  className?: string; // wrapper
  iconClassName?: string; // icon
  label?: string;
} & IconBaseProps;

function hasSizeClass(className?: string) {
  if (!className) return false;
  return className
    .split(' ')
    .some((c) => c.startsWith('w-') || c.startsWith('h-') || c.startsWith('size-'));
}

function Loading({
  visible = true,
  className,
  iconClassName,
  label = 'Loading',
  ...props
}: LoadingProps) {
  if (!visible) return null;

  const hasCustomSize = hasSizeClass(iconClassName);
  console.log(iconClassName, hasCustomSize);
  return (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn('inline-flex items-center justify-center', className)}
    >
      <span className="sr-only">{label}</span>

      <LuLoaderIcon
        aria-hidden="true"
        className={cn('text-brand-800 animate-spin', !hasCustomSize && 'size-4', iconClassName)}
        {...props}
      />
    </span>
  );
}

export default Loading;
