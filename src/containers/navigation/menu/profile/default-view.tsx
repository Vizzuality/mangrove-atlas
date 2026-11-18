'use client';

import { trackEvent } from '@/lib/analytics/ga';

import { Close as DialogPrimitiveClose } from '@radix-ui/react-dialog';
import { useSession } from 'next-auth/react';

import { formatSavedAt, useDefaultView } from 'hooks/use-default-view';

import { useUpdateDefaultView } from '@/containers/auth/hooks';
import BASEMAPS from '@/containers/datasets/contextual-layers/basemaps';

import { Button } from 'components/ui/button';

const DefaultView = () => {
  const { data: session } = useSession();
  const settings = session?.user?.settings;

  const { getCurrentView, applyView, resetView } = useDefaultView();
  const updateDefaultView = useUpdateDefaultView();

  const basemapName = BASEMAPS.find(({ id }) => id === settings?.basemap)?.name;
  const widgetsCount = settings?.widgets.length ?? 0;

  const handleSave = () => {
    updateDefaultView.mutate(getCurrentView());
    trackEvent('Default view - save', {
      category: 'Menu - profile - default view',
      action: settings ? 'Replace' : 'Save',
      label: 'Default view',
    });
  };

  // No preventDefault: the button is wrapped in Radix `Dialog.Close`, which skips
  // closing the host dialog when the click event is default-prevented.
  const handleApply = () => {
    if (!settings) return;
    applyView(settings);
    trackEvent('Default view - apply', {
      category: 'Menu - profile - default view',
      action: 'Apply',
      label: 'Default view',
    });
  };

  const handleReset = () => {
    updateDefaultView.mutate(null, { onSuccess: resetView });
    trackEvent('Default view - reset', {
      category: 'Menu - profile - default view',
      action: 'Reset',
      label: 'Default view',
    });
  };

  return (
    <div className="flex flex-col gap-1.5 p-1">
      <p className="text-xs font-semibold">Default view</p>
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-3">
        {settings ? (
          // Close the host dialog so the map is visible after applying the view.
          <DialogPrimitiveClose asChild>
            <button
              type="button"
              title="Apply your default view"
              className="focus-visible:ring-brand-500 -m-1 flex flex-col gap-0.5 rounded-lg p-1 text-left text-sm leading-5 text-black/85 hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none"
              onClick={handleApply}
            >
              {settings.saved_at && (
                <span className="font-semibold">Saved on {formatSavedAt(settings.saved_at)}</span>
              )}
              <span className="font-light">
                {basemapName && `${basemapName} basemap · `}
                <span className="notranslate">{widgetsCount}</span>{' '}
                {widgetsCount === 1 ? 'widget' : 'widgets'}
              </span>
            </button>
          </DialogPrimitiveClose>
        ) : (
          <div className="flex flex-col gap-0.5 text-sm leading-5 text-black/85">
            <p className="font-light">Using platform default</p>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-brand-800 font-semibold"
            disabled={updateDefaultView.isPending}
            onClick={handleSave}
          >
            {settings ? 'Replace with current view' : 'Save current view as default'}
          </Button>
          {settings && (
            <Button
              type="button"
              variant="link"
              className="border-transparent px-1 font-semibold underline"
              disabled={updateDefaultView.isPending}
              onClick={handleReset}
            >
              Reset to default
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultView;
