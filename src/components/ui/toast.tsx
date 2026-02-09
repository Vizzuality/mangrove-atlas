'use client';

import {
  CheckCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
  Cross1Icon,
  ReloadIcon,
} from '@radix-ui/react-icons';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ icon = false, ...props }: ToasterProps & { icon?: boolean }) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster font-inter group text-sm font-bold shadow-[0px_4px_12px_0px_#00000014]"
      icons={
        !icon
          ? undefined
          : {
              success: <CheckCircledIcon className="text-brand-800 size-4 fill-current" />,
              info: <InfoCircledIcon className="bg-brand-800 size-4" />,
              warning: <ExclamationTriangleIcon className="bg-brand-800 size-4" />,
              error: <Cross1Icon className="bg-brand-800 size-4" />,
              loading: <ReloadIcon className="bg-brand-800 size-4 animate-spin" />,
            }
      }
      style={
        {
          '--normal-bg': '#fff',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
