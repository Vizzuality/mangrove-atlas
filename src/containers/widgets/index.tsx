import { FC, useMemo } from 'react';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { isOfflineAtom } from '@/store/offline';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useAtom, useAtomValue } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import WidgetsLayout from '@/layouts/widgets';

import CloseHelpGuide from '@/containers/help/close';
import AppTools from '@/containers/navigation';
import {
  widgets,
  ANALYSIS_WIDGETS_SLUGS,
  OFFLINE_ENABLED_WIDGETS_SLUGS,
} from '@/containers/widgets/constants';
import { useActivateOfflineWidgets } from '@/containers/widgets/hooks';

import { Dialog } from '@/components/ui/dialog';
import { WidgetTypes } from 'types/widget';

import PrintReportButton from './print-report-button';
import WidgetCard from './widget-card';
import WidgetsCardsControls from './widgets-cards-controls';
import WidgetsDeckContent from './widgets-deck/content';
import WidgetsDeckButton from './widgets-deck-button';

const WidgetsContainer: FC = () => {
  const [{ customGeojson }] = useAtom(drawingToolAtom);
  const [{ uploadedGeojson }] = useAtom(drawingUploadToolAtom);

  const [activeWidgets] = useSyncActiveWidgets();
  const { type: locationType } = useSyncLocation();
  const currentLocation = locationType || 'worldwide';
  const isOffline = useAtomValue(isOfflineAtom);

  // Offline: force-activate the offline-supported widgets + their layers.
  useActivateOfflineWidgets();

  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    const list = widgets.filter(
      ({ slug, locationType: widgetLocations }) =>
        widgetLocations.includes(currentLocation) &&
        (activeWidgets?.includes(slug) || slug === 'widgets_deck_tool')
    );
    // Offline: surface the offline-ready widgets on top (stable within groups).
    if (isOffline) {
      return [...list].sort(
        (a, b) =>
          (OFFLINE_ENABLED_WIDGETS_SLUGS.includes(a.slug) ? 0 : 1) -
          (OFFLINE_ENABLED_WIDGETS_SLUGS.includes(b.slug) ? 0 : 1)
      );
    }
    return list;
  }, [
    activeWidgets,
    currentLocation,
    customGeojson,
    uploadedGeojson,
    isOffline,
  ]) satisfies WidgetTypes[];

  const isCustomArea = !!(customGeojson || uploadedGeojson);

  return (
    <WidgetsLayout>
      <AppTools />
      <CloseHelpGuide />
      <WidgetsCardsControls />

      {/* Always rendered so the list is in the SSR/first paint. The mobile
          spacing is applied via Tailwind responsive utilities (reset at lg)
          rather than a JS width check, which previously delayed the list until
          hydration and caused a layout shift. */}
      <div data-testid="widgets-wrapper" className="mt-5 pb-16 lg:mt-0 lg:pb-0">
        {widgetsAvailable.map((widget) => (
          <WidgetCard key={widget.slug} widget={widget} />
        ))}
      </div>

      <Dialog>
        <WidgetsDeckButton />
        <WidgetsDeckContent />
      </Dialog>

      {!!widgetsAvailable.length && isCustomArea && <PrintReportButton />}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
