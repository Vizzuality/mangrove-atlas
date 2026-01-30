'use client';

import { Button } from 'components/ui/button';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import {
  useGetUserNotificationPreferences,
  usePostToggleLocationAlerts,
} from 'containers/subscriptions/hooks';
import { useState } from 'react';

const SubscriptionsContent = () => {
  const data = useGetUserNotificationPreferences();
  console.log(DataTransfer, 'jdshfdsfljsdhflkjh');
  const handleClickAlerts = () => {
    toggleMutation.mutate({
      location_alerts: data.data?.notification_preferences[0].location_alerts,
    });
  };

  const handleClickWhatsNew = () => {
    return toggleMutation.mutate({ newsletter: data.data?.notification_preferences[0].newsletter });
  };

  const toggleMutation = usePostToggleLocationAlerts();

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
          <SwitchRoot onClick={handleClickAlerts} checked={location_alerts}>
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
          <SwitchRoot
            onClick={handleClickWhatsNew}
            checked={data.data?.notification_preferences[0].newsletter}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
      <Button className="w-fit" size="lg">
        Save changes
      </Button>
    </div>
  );
};

export default SubscriptionsContent;
