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
 * Widgets whose year timeline or brushed chart collapses at half the page
 * width — their axis labels overrun the card — so they take the full 190mm.
 */
const FULL_WIDTH_SLUGS: string[] = [
  'mangrove_national_dashboard',
  'mangrove_habitat_extent',
  'mangrove_net_change',
  'mangrove_habitat_change',
  'mangrove_alerts',
  // Its donut collapses to nothing inside a half-width card.
  'mangrove_species_threatened',
  'mangrove_drivers_change',
  'mangrove_global_tidal_wetland_change',
];

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

  return (
    // Grid rather than CSS multi-column, which reflows badly once the print
    // engine paginates. Sizes stay identical on screen and in print so the
    // preview is the printed page.
    <div className="grid grid-cols-2 items-start gap-3 py-6">
      {widgetsAvailable.map(({ slug, name }) => {
        const Widget = WIDGETS[slug];
        if (!Widget) return null;

        return (
          <PrintWidgetCard key={slug} name={name} fullWidth={FULL_WIDTH_SLUGS.includes(slug)}>
            <Widget />
          </PrintWidgetCard>
        );
      })}
    </div>
  );
};

export default PrintReportPage;
