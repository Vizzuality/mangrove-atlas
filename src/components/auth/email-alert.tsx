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
        'text-brand-800 flex items-start gap-3 rounded-md border border-gray-900/50 bg-white px-4 py-3',
        className,
      ].join(' ')}
    >
      <div className="text-brand-800 mt-0.5 shrink-0">
        <CheckCircledIcon strokeWidth={2} className="h-5 w-5" />
      </div>

      <div className="text-sm leading-5">{message}</div>
    </div>
  );
}
