'use client';

import { useMemo, useState } from 'react';

import { Button } from 'components/ui/button';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import {
  useGetUserNotificationPreferences,
  usePostToggleLocationAlerts,
} from '@/containers/subscriptions/hooks';
import { Loading } from '@/components/ui/loading';

import { DataUserNotificationPreferencesToggleLocationAlerts } from '@/containers/subscriptions/hooks';

const SubscriptionsContent = () => {
  const { data, isLoading } = useGetUserNotificationPreferences();
  const toggleMutation = usePostToggleLocationAlerts();

  const userPreferences = useMemo(
    () => (data ? (data.data as DataUserNotificationPreferencesToggleLocationAlerts) : undefined),
    [data]
  );

  const [selection, setSelection] = useState<
    Partial<DataUserNotificationPreferencesToggleLocationAlerts>
  >({});

  const effective = useMemo(() => {
    if (!userPreferences) return undefined;
    return { ...userPreferences, ...selection };
  }, [userPreferences, selection]);

  if (isLoading || !effective) return <Loading />;

  const handleToggleLocationAlerts = (checked: boolean) => {
    setSelection((d) => ({ ...d, location_alerts: checked }));
  };

  const handleToggleNewsletter = (checked: boolean) => {
    setSelection((d) => ({ ...d, newsletter: checked }));
  };

  const hasChanges = Object.keys(selection).length > 0;

  const handleSaveChanges = () => {
    if (!userPreferences) return;

    toggleMutation.mutate(
      { ...userPreferences, ...selection } as DataUserNotificationPreferencesToggleLocationAlerts,
      {
        onSuccess: () => {
          setSelection({});
        },
      }
    );
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
            checked={effective.location_alerts}
            onCheckedChange={handleToggleLocationAlerts}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>

      <div className="flex items-center justify-between gap-12">
        <div className="flex max-w-sm flex-col justify-between gap-2">
          <span className="text-lg font-light">What's new</span>
          <p className="text-sm text-[#939393]">
            Weekly updates on mangrove conservation news and the latest platform enhancements.
          </p>
        </div>

        <SwitchWrapper id="newsletter">
          <SwitchRoot checked={effective.newsletter} onCheckedChange={handleToggleNewsletter}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>

      <Button
        className="w-fit"
        size="lg"
        onClick={handleSaveChanges}
        disabled={!hasChanges || toggleMutation.isLoading}
      >
        Save changes
      </Button>
    </div>
  );
};

export default SubscriptionsContent;
