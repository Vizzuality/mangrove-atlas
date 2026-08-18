'use client';

import { useMemo } from 'react';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useAtom } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import { WIDGETS } from '@/containers/datasets';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from '@/containers/widgets/constants';

import type { WidgetTypes } from 'types/widget';

import PrintWidgetCard from './widget-card';

/**
 * Opens the report directly below the map and is the only card to span the
 * full 277mm page width; every other widget takes half.
 */
const LEAD_SLUG = 'mangrove_habitat_extent';

const PrintReportPage = () => {
  const [{ customGeojson }] = useAtom(drawingToolAtom);
  const [{ uploadedGeojson }] = useAtom(drawingUploadToolAtom);
  const [activeWidgets] = useSyncActiveWidgets();
  const { type: locationType } = useSyncLocation();
  const currentLocation = locationType || 'worldwide';

  // Selected widgets for this location — the same rule the sidebar applies.
  // Deliberately NOT `useWidgets()`: that also intersects with the selected
  // category, which would drop every active widget filed under a different one
  // (and the category defaults to `distribution_and_change` when the report URL
  // carries no `category` param).
  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return widgets.filter(
      ({ slug, locationType: widgetLocations }) =>
        widgetLocations.includes(currentLocation) &&
        activeWidgets?.includes(slug) &&
        slug !== 'widgets_deck_tool'
    );
  }, [activeWidgets, currentLocation, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

  // Habitat extent leads the report, directly under the map, as in the design.
  const orderedWidgets = useMemo(
    () => [
      ...widgetsAvailable.filter(({ slug }) => slug === LEAD_SLUG),
      ...widgetsAvailable.filter(({ slug }) => slug !== LEAD_SLUG),
    ],
    [widgetsAvailable]
  );

  return (
    // Grid rather than CSS multi-column, which reflows badly once the print
    // engine paginates. Sizes stay identical on screen and in print so the
    // preview is the printed page.
    <div className="grid grid-flow-row-dense grid-cols-2 items-start gap-3 py-6">
      {orderedWidgets.map(({ slug, name, applicability }) => {
        const Widget = WIDGETS[slug];
        if (!Widget) return null;

        return (
          <PrintWidgetCard
            key={slug}
            name={name}
            applicability={applicability}
            fullWidth={slug === LEAD_SLUG}
          >
            <Widget />
          </PrintWidgetCard>
        );
      })}
    </div>
  );
};

export default PrintReportPage;
