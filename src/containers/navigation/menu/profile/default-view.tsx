'use client';

import { trackEvent } from '@/lib/analytics/ga';

import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

import { useDefaultView } from 'hooks/use-default-view';

import { useUpdateDefaultView } from '@/containers/auth/hooks';
import BASEMAPS from '@/containers/datasets/contextual-layers/basemaps';

import { Button } from 'components/ui/button';

const DefaultView = () => {
  const { data: session } = useSession();
  const settings = session?.user?.settings;

  const { getCurrentView, resetView } = useDefaultView();
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
        <div className="flex flex-col gap-0.5 text-sm leading-5 text-black/85">
          {settings ? (
            <>
              {settings.saved_at && (
                <p className="font-semibold">
                  Saved on {format(new Date(settings.saved_at), 'd MMM yyyy')}
                </p>
              )}
              <p className="font-light">
                {basemapName && `${basemapName} basemap · `}
                <span className="notranslate">{widgetsCount}</span>{' '}
                {widgetsCount === 1 ? 'widget' : 'widgets'}
              </p>
            </>
          ) : (
            <p className="font-light">Using platform default</p>
          )}
        </div>
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
