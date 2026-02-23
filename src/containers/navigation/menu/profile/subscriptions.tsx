'use client';

import { useMemo, useState, useCallback } from 'react';

import { Button } from 'components/ui/button';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import { Loading } from '@/components/ui/loading';

import {
  useGetUserNotificationPreferences,
  usePostToggleLocationAlerts,
  type DataUserNotificationPreferencesToggleLocationAlerts,
} from '@/containers/subscriptions/hooks';
import { useGetUserLocations } from '@/containers/datasets/locations/user-locations';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Draft = Partial<DataUserNotificationPreferencesToggleLocationAlerts>;

const SubscriptionsContent = () => {
  const { data: dataUserNotificationsPreferences, isLoading } = useGetUserNotificationPreferences();
  const { data: dataUserLocations } = useGetUserLocations();
  const toggleMutation = usePostToggleLocationAlerts();

  const serverPrefs =
    (dataUserNotificationsPreferences?.data as
      | DataUserNotificationPreferencesToggleLocationAlerts
      | undefined) ?? undefined;

  const [basePrefs, setBasePrefs] = useState<
    DataUserNotificationPreferencesToggleLocationAlerts | undefined
  >(undefined);

  const userPreferences = basePrefs ?? serverPrefs;

  const [selection, setSelection] = useState<Draft>({});

  const effective = useMemo(() => {
    if (!userPreferences) return undefined;
    return { ...userPreferences, ...selection };
  }, [userPreferences, selection]);

  const isSaving = toggleMutation.isLoading;

  const setField = useCallback((key: keyof Draft, value: boolean) => {
    setSelection((prev) => ({ ...prev, [key]: value }));
  }, []);

  const hasChanges = useMemo(() => {
    if (!userPreferences) return false;
    const next = { ...userPreferences, ...selection };
    return (
      next.location_alerts !== userPreferences.location_alerts ||
      next.newsletter !== userPreferences.newsletter
    );
  }, [userPreferences, selection]);

  const handleSaveChanges = useCallback(() => {
    if (!userPreferences) return;

    const payload: DataUserNotificationPreferencesToggleLocationAlerts = {
      ...userPreferences,
      ...selection,
    };

    toggleMutation.mutate(payload, {
      onSuccess: () => {
        setBasePrefs(payload);
        setSelection({});
      },
    });
  }, [userPreferences, selection, toggleMutation]);

  if (isLoading) return <Loading />;

  const hasLocations = (dataUserLocations?.data.length ?? 0) > 0;
  const isDisabled = !hasLocations || isSaving;

  return (
    <div className="flex flex-col space-y-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block">
            <div className="flex items-center gap-12">
              <div className="flex max-w-sm flex-col justify-between gap-2 text-left">
                <span className="text-lg font-light">Alerts notification</span>
                <p className="text-sm text-[#939393]">
                  Emails with mangrove disturbance alerts related to your saved areas.
                </p>
              </div>

              <SwitchWrapper id="alerts">
                <SwitchRoot
                  checked={!!effective?.location_alerts}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => setField('location_alerts', checked)}
                >
                  <SwitchThumb />
                </SwitchRoot>
              </SwitchWrapper>
            </div>
          </span>
        </TooltipTrigger>

        {!hasLocations && (
          <TooltipContent
            side="right"
            className="shadow-soft max-w-[190px] rounded-3xl bg-white p-4 text-black/85 first-letter:uppercase"
          >
            Save at least one area to activate notifications.
            <TooltipArrow className="fill-white" width={10} height={5} />
          </TooltipContent>
        )}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block">
            <div className="flex items-center justify-between gap-12">
              <div className="flex max-w-sm flex-col justify-between gap-2">
                <span className="text-lg font-light">What&apos;s new</span>
                <p className="text-sm text-[#939393]">
                  Weekly updates on mangrove conservation news and the latest platform enhancements.
                </p>
              </div>

              <SwitchWrapper id="newsletter">
                <SwitchRoot
                  checked={!!effective?.newsletter}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => setField('newsletter', checked)}
                >
                  <SwitchThumb />
                </SwitchRoot>
              </SwitchWrapper>
            </div>
          </span>
        </TooltipTrigger>

        {!hasLocations && (
          <TooltipContent
            side="right"
            className="shadow-soft max-w-[190px] rounded-3xl bg-white p-4 text-black/85 first-letter:uppercase"
          >
            Save at least one area to activate notifications.
            <TooltipArrow className="fill-white" width={10} height={5} />
          </TooltipContent>
        )}
      </Tooltip>

      <Button
        className="w-fit"
        size="lg"
        onClick={handleSaveChanges}
        disabled={!hasChanges || isSaving}
      >
        {isSaving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  );
};

export default SubscriptionsContent;
