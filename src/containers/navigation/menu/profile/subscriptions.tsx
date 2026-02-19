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

type Draft = Partial<DataUserNotificationPreferencesToggleLocationAlerts>;

const SubscriptionsContent = () => {
  const { data, isLoading } = useGetUserNotificationPreferences();
  const toggleMutation = usePostToggleLocationAlerts();

  const serverPrefs =
    (data?.data as DataUserNotificationPreferencesToggleLocationAlerts | undefined) ?? undefined;

  // Local "base" to avoid UI snapping back to stale server data after save
  const [basePrefs, setBasePrefs] = useState<
    DataUserNotificationPreferencesToggleLocationAlerts | undefined
  >(undefined);

  // Choose the freshest base:
  // - if we've saved locally, use basePrefs
  // - otherwise fall back to serverPrefs
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
        // Update local base immediately so UI doesn't revert to stale server data
        setBasePrefs(payload);
        // Now safe to clear selection (effective still equals payload)
        setSelection({});
      },
    });
  }, [userPreferences, selection, toggleMutation]);

  // Initialize basePrefs once we have server prefs (without useEffect):
  // If basePrefs is undefined and we now have serverPrefs, set it during render via lazy init pattern:
  // We'll do it safely by deriving userPreferences above. Alternatively, you can set initial state:
  // useState(serverPrefs) won't update later, so we keep basePrefs optional and rely on serverPrefs until first save.

  if (isLoading || !effective) return <Loading />;

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
            checked={!!effective.location_alerts}
            disabled={isSaving}
            onCheckedChange={(checked) => setField('location_alerts', checked)}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>

      <div className="flex items-center justify-between gap-12">
        <div className="flex max-w-sm flex-col justify-between gap-2">
          <span className="text-lg font-light">What&apos;s new</span>
          <p className="text-sm text-[#939393]">
            Weekly updates on mangrove conservation news and the latest platform enhancements.
          </p>
        </div>

        <SwitchWrapper id="newsletter">
          <SwitchRoot
            checked={!!effective.newsletter}
            disabled={isSaving}
            onCheckedChange={(checked) => setField('newsletter', checked)}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>

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
