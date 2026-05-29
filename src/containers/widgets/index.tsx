import { FC, useMemo } from 'react';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useAtom } from 'jotai';
import { useWindowSize } from 'usehooks-ts';

import { useSyncLocation } from 'hooks/use-sync-location';

import WidgetsLayout from '@/layouts/widgets';

import CloseHelpGuide from '@/containers/help/close';
import AppTools from '@/containers/navigation';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from '@/containers/widgets/constants';

import { Dialog } from '@/components/ui/dialog';
import { breakpoints } from '@/styles/styles.config';
import { WidgetTypes } from 'types/widget';

import PrintReportButton from './print-report-button';
import WidgetCard from './widget-card';
import WidgetsCardsControls from './widgets-cards-controls';
import WidgetsDeckContent from './widgets-deck/content';
import WidgetsDeckButton from './widgets-deck-button';

const WidgetsContainer: FC = () => {
  const [{ customGeojson }] = useAtom(drawingToolAtom);
  const [{ uploadedGeojson }] = useAtom(drawingUploadToolAtom);

  const { width: screenWidth } = useWindowSize();
  const [activeWidgets] = useSyncActiveWidgets();
  const { type: locationType } = useSyncLocation();
  const currentLocation = locationType || 'worldwide';

  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return widgets.filter(
      ({ slug, locationType: widgetLocations }) =>
        widgetLocations.includes(currentLocation) &&
        (activeWidgets?.includes(slug) || slug === 'widgets_deck_tool')
    );
  }, [activeWidgets, currentLocation, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

  const isCustomArea = !!(customGeojson || uploadedGeojson);
  const isMobile = screenWidth > 0 && screenWidth < breakpoints.xl;
  const showList = screenWidth > 0;

  return (
    <WidgetsLayout>
      <AppTools />
      <CloseHelpGuide />
      <WidgetsCardsControls />

      {showList && (
        <div
          data-testid="widgets-wrapper"
          className={isMobile ? 'mt-5 pb-16 xl:mt-0 xl:pb-0' : undefined}
        >
          {widgetsAvailable.map((widget) => (
            <WidgetCard key={widget.slug} widget={widget} />
          ))}
        </div>
      )}

      <Dialog>
        <WidgetsDeckButton />
        <WidgetsDeckContent />
      </Dialog>

      {!!widgetsAvailable.length && isCustomArea && <PrintReportButton />}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
