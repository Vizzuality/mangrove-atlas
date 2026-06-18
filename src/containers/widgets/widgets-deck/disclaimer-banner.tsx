import { FC } from 'react';

import ALERT_SVG from '@/svgs/ui/alert';

const DisclaimerBanner: FC = () => {
  return (
    <div
      role="note"
      className="shadow-control flex w-full items-center space-x-4 rounded-3xl bg-gray-50 p-2.5"
    >
      <ALERT_SVG
        className="text-brand-900 h-16 w-16 shrink-0 fill-current"
        fillOpacity={0.15}
        aria-hidden="true"
        focusable="false"
      />
      <p className="text-sm font-light text-black/85">
        <span className="font-medium">Disclaimer:</span> Some layers and widgets are not available
        for certain locations. Select applicable geography to enable layer.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
