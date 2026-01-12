'use client';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import { useState } from 'react';

const SubscriptionsContent = () => {
  const [isActive, setIsActive] = useState(true);
  const handleClick = () => {
    // Handle subscription toggle logic here
  };
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between gap-12">
        <div className="flex max-w-sm flex-col justify-between gap-2">
          <span className="text-lg font-light">Alerts notification</span>
          <p className="text-sm text-[#939393]">
            Emails with mangrove disturbance alerts related to your saved areas.
          </p>
        </div>
        <SwitchWrapper id="alerts">
          <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
      <div className="flex items-center justify-between gap-12">
        <div className="flex max-w-sm flex-col justify-between gap-2">
          <span className="text-lg font-light">What's new</span>
          <p className="text-sm text-[#939393]">
            Weekly updates on mangrove conservation news and the latest platform enhancements.{' '}
          </p>
        </div>
        <SwitchWrapper id="alerts">
          <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
    </div>
  );
};

export default SubscriptionsContent;
