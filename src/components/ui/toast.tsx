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
              success: <CheckCircledIcon className="size-4" />,
              info: <InfoCircledIcon className="size-4" />,
              warning: <ExclamationTriangleIcon className="size-4" />,
              error: <Cross1Icon className="size-4" />,
              loading: <ReloadIcon className="size-4 animate-spin" />,
            }
      }
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
