import cn from '@/lib/classnames';
import { LuLoaderCircle } from 'react-icons/lu';
import { IconBaseProps } from 'react-icons/lib/iconBase';

const LuLoaderIcon = LuLoaderCircle as unknown as (p: IconBaseProps) => JSX.Element;

type LoadingProps = {
  visible?: boolean;
  className?: string; // wrapper
  iconClassName?: string; // icon
  label?: string;
} & IconBaseProps;

function Loading({
  visible = true,
  className,
  iconClassName,
  label = 'Loading',
  ...props
}: LoadingProps) {
  if (!visible) return null;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn('block w-full', className)}
    >
      <span className="sr-only">{label}</span>

      <LuLoaderIcon
        aria-hidden="true"
        className={cn(
          'text-brand-800 block animate-spin',
          !iconClassName?.match(/w-|h-|size-/) && 'size-4',
          iconClassName
        )}
        {...props}
      />
    </span>
  );
}

export default Loading;
