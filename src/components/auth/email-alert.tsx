import React from 'react';
import { CheckCircledIcon } from '@radix-ui/react-icons';

type SuccessAlertProps = {
  message?: string;
  className?: string;
};

export default function SuccessAlert({
  message = 'Please check your email for verification instructions.',
  className = '',
}: SuccessAlertProps) {
  return (
    <div
      role="alert"
      className={[
        'flex items-start gap-3 rounded-md border border-gray-900/50 bg-white px-4 py-3 text-brand-800',
        className,
      ].join(' ')}
    >
      <div className="mt-0.5 shrink-0 text-brand-800">
        <CheckCircledIcon strokeWidth={2} className="h-5 w-5" />
      </div>

      <div className="text-sm leading-5">{message}</div>
    </div>
  );
}
