'use client';

import {
  CheckCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
  Cross1Icon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ icon = false, ...props }: ToasterProps & { icon?: boolean }) => {
  return (
    // App has no dark mode: force light so sonner's text color matches the
    // hardcoded white --normal-bg below. Passing "system" here let dark-OS
    // users get near-white text on white → an apparently empty toast (GMW-1043).
    <Sonner
      theme="light"
      className="toaster group font-inter text-sm font-bold shadow-[0px_4px_12px_0px_#00000014]"
      icons={
        !icon
          ? undefined
          : {
              success: (
                <CheckCircledIcon
                  className="text-brand-800 size-4 fill-current"
                  aria-hidden="true"
                />
              ),
              info: <InfoCircledIcon className="bg-brand-800 size-4" aria-hidden="true" />,
              warning: (
                <ExclamationTriangleIcon className="bg-brand-800 size-4" aria-hidden="true" />
              ),
              error: <Cross1Icon className="bg-brand-800 size-4" aria-hidden="true" />,
              loading: (
                <ReloadIcon className="bg-brand-800 size-4 animate-spin" aria-hidden="true" />
              ),
            }
      }
      style={
        {
          '--normal-bg': '#fff',
          // Pin the text color so it can never end up light-on-white, regardless
          // of the resolved theme (brand-900). Defensive alongside theme="light".
          '--normal-text': '#003C39',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
