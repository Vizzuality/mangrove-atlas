'use client';

import { Button } from 'components/ui/button';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import {
  useGetUserNotificationPreferences,
  usePostToggleLocationAlerts,
} from '@/containers/subscriptions/hooks';

const SubscriptionsContent = () => {
  const { data } = useGetUserNotificationPreferences();

  const toggleMutation = usePostToggleLocationAlerts();

  const handleClickAlerts = () => {
    toggleMutation.mutate({
      ...data?.notification_preferences,
      location_alerts: data?.notification_preferences?.location_alerts,
    });
  };

  const handleClickWhatsNew = () => {
    return toggleMutation.mutate({
      ...data?.notification_preferences,
      newsletter: data?.notification_preferences?.newsletter,
    });
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
          <SwitchRoot
            onClick={handleClickAlerts}
            checked={data?.notification_preferences?.location_alerts}
          >
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
            checked={data?.notification_preferences?.newsletter}
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
