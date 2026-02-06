import { forwardRef, InputHTMLAttributes } from 'react';

import cn from '@/lib/classnames';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn({
        'border-input ring-offset-background focus-visible:ring-ring border-opacity-15 focus:ring-brand-800 flex h-9 w-full rounded-3xl border border-black/15 bg-transparent px-3 py-2 text-sm text-black/85 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black/40 focus:ring-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50':
          true,
        [className]: !!className,
      })}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
