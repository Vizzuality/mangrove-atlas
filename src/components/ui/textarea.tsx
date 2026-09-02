import { forwardRef, TextareaHTMLAttributes } from 'react';

import cn from '@/lib/classnames';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(className, {
        'focus-visible:ring-brand-800 focus:ring-brand-800 flex min-h-16 w-full rounded-xl border border-black/15 bg-transparent px-3 py-2 text-sm text-black/85 ring-offset-white placeholder:text-black/60 focus:ring-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50': true,
      })}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
