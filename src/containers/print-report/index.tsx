'use client';

import { useMemo } from 'react';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useAtom } from 'jotai';

import { WIDGETS } from '@/containers/datasets';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from '@/containers/widgets/constants';
import { useWidgets } from '@/containers/widgets/hooks';

import type { WidgetTypes } from 'types/widget';

import PrintWidgetCard from './widget-card';

/**
 * Opens the report directly below the map and is the only card to span the
 * full 190mm page width; every other widget takes half.
 */
const LEAD_SLUG = 'mangrove_habitat_extent';

const PrintReportPage = () => {
  const [{ customGeojson }] = useAtom(drawingToolAtom);
  const [{ uploadedGeojson }] = useAtom(drawingUploadToolAtom);
  const [activeWidgets] = useSyncActiveWidgets();
  const enabledWidgets = useWidgets();

  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return enabledWidgets.filter(
      ({ slug }) => activeWidgets?.includes(slug) && slug !== 'widgets_deck_tool'
    );
  }, [activeWidgets, enabledWidgets, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

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
      {orderedWidgets.map(({ slug, name }) => {
        const Widget = WIDGETS[slug];
        if (!Widget) return null;

        return (
          <PrintWidgetCard key={slug} name={name} fullWidth={slug === LEAD_SLUG}>
            <Widget />
          </PrintWidgetCard>
        );
      })}
    </div>
  );
};

export default PrintReportPage;
