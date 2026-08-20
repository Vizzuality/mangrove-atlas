'use client';

import { useCallback, useMemo, useState } from 'react';

import cn from '@/lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { useSyncActiveLayers } from '@/store/layers';
import { useSyncActiveWidgets } from '@/store/widgets';
import { SpeciesLocationState } from '@/store/widgets/species-location';

import { useAtom, useAtomValue } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import { WIDGETS } from '@/containers/datasets';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from '@/containers/widgets/constants';

import type { WidgetTypes } from 'types/widget';

import {
  COASTAL_PROTECTION_PRINT_WIDGETS,
  COASTAL_PROTECTION_SLUG,
  FULL_WIDTH_SLUGS,
  LEAD_SLUG,
  MAX_LAYER_CARDS,
} from './constants';
import PrintLayerCard from './layer-card';
import PrintWidgetCard from './widget-card';

const PrintReportPage = () => {
  const [{ customGeojson }] = useAtom(drawingToolAtom);
  const [{ uploadedGeojson }] = useAtom(drawingUploadToolAtom);
  const [activeWidgets] = useSyncActiveWidgets();
  const selectedSpecies = useAtomValue(SpeciesLocationState);
  const { type: locationType } = useSyncLocation();
  const currentLocation = locationType || 'worldwide';

  const [activeLayers] = useSyncActiveLayers();
  const activeLayerIds = useMemo(() => activeLayers?.map((l) => l?.id) ?? [], [activeLayers]);

  // Matched on the slug, not on `layersIds`: a layer can be listed by more than
  // one widget (the WDPA layer belongs to the contextual card and is also read
  // by the protected-areas widget), and only the widget that owns it should be
  // pulled into the report by it being switched on. `subLayersIds` are the
  // exception: coastal protection's layers are toggled under their own ids,
  // never under the widget's slug, and no other widget lists them.
  const ownsActiveLayer = useCallback(
    ({ slug, subLayersIds }: WidgetTypes) =>
      activeLayerIds.some(
        (activeId) => activeId === slug || (subLayersIds ?? []).includes(activeId)
      ),
    [activeLayerIds]
  );

  // Selected widgets for this location — the same rule the sidebar applies,
  // plus any widget whose layer is switched on. The contextual layers (salt
  // marsh, tidal flats, the coral atlas…) are toggled from the layers panel and
  // never enter `active-widgets`, so on that rule alone they were on the map the
  // report was built from and absent from the report itself.
  //
  // Deliberately NOT `useWidgets()`: that also intersects with the selected
  // category, which would drop every active widget filed under a different one
  // (and the category defaults to `distribution_and_change` when the report URL
  // carries no `category` param).
  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return (
      widgets
        .filter(
          (widget) =>
            widget.locationType.includes(currentLocation) &&
            (activeWidgets?.includes(widget.slug) || ownsActiveLayer(widget)) &&
            widget.slug !== 'widgets_deck_tool' &&
            // Species location is a picker: with no species chosen it has nothing to
            // report, so it is left out of the grid entirely rather than taking a
            // cell for an empty card.
            (widget.slug !== 'mangrove_species_location' || !!selectedSpecies)
        )
        // Coastal protection prints as three cards, one per indicator, so each
        // pairs with the map of its own layer.
        .flatMap((widget) =>
          widget.slug === COASTAL_PROTECTION_SLUG ? COASTAL_PROTECTION_PRINT_WIDGETS : [widget]
        )
    );
  }, [
    activeWidgets,
    currentLocation,
    customGeojson,
    uploadedGeojson,
    ownsActiveLayer,
    selectedSpecies,
  ]) satisfies WidgetTypes[];

  // Habitat extent leads the report, directly under the map, as in the design.
  const orderedWidgets = useMemo(
    () => [
      ...widgetsAvailable.filter(({ slug }) => slug === LEAD_SLUG),
      ...widgetsAvailable.filter(({ slug }) => slug !== LEAD_SLUG),
    ],
    [widgetsAvailable]
  );

  // A widget earns a map card when one of its layers is switched on. Full-width
  // widgets are skipped: their card already owns the whole row — and the lead
  // widget's layer is what the big opening map is showing.
  const layerCardsBySlug = useMemo(() => {
    const entries = orderedWidgets
      .filter(({ slug }) => !FULL_WIDTH_SLUGS.includes(slug))
      .map(({ slug, categoryIds, layersIds, subLayersIds }) => {
        const ownedIds = [...(layersIds ?? []), ...(subLayersIds ?? [])];
        const active = ownedIds.filter((layerId) =>
          activeLayerIds.some((activeId) => activeId?.includes(layerId))
        );
        // A contextual-layer widget IS its layer — the card is nothing but a
        // description of what the map shows — so it keeps its map even when the
        // layer was never switched on in the app.
        const ids = categoryIds.includes('contextual_layers') ? ownedIds : active;
        return [slug as string, ids] as const;
      })
      .filter(([, ids]) => ids.length > 0)
      .slice(0, MAX_LAYER_CARDS);

    return Object.fromEntries(entries) as Record<string, string[]>;
  }, [orderedWidgets, activeLayerIds]);

  /**
   * Rows of the two-column grid. A widget with a layer takes a row with its map
   * beside it. One without pairs up with the next layer-less widget; if the next
   * widget brings a map of its own, the half stays blank rather than pulling an
   * unrelated widget alongside.
   */
  const rows = useMemo(() => {
    const built: { widget: WidgetTypes; companion: WidgetTypes | null }[] = [];

    for (let i = 0; i < orderedWidgets.length; i += 1) {
      const widget = orderedWidgets[i];

      if (FULL_WIDTH_SLUGS.includes(widget.slug) || layerCardsBySlug[widget.slug]) {
        built.push({ widget, companion: null });
        continue;
      }

      const next = orderedWidgets[i + 1];
      const nextPairs =
        !!next && !FULL_WIDTH_SLUGS.includes(next.slug) && !layerCardsBySlug[next.slug];

      built.push({ widget, companion: nextPairs ? next : null });
      if (nextPairs) i += 1;
    }

    return built;
  }, [orderedWidgets, layerCardsBySlug]);

  /**
   * Widgets currently rendering an empty state. Held here rather than in the
   * card so a hidden widget takes its map card down with it — otherwise the map
   * stays in the grid and slides up next to an unrelated widget.
   */
  const [emptySlugs, setEmptySlugs] = useState<Record<string, boolean>>({});

  const handleEmptyChange = useCallback((slug: string, isEmpty: boolean) => {
    setEmptySlugs((current) =>
      current[slug] === isEmpty ? current : { ...current, [slug]: isEmpty }
    );
  }, []);

  return (
    // One grid per row, not one big grid: Chromium does not honour
    // `break-inside: avoid` on the items of a fragmented grid, so in a single
    // grid the last row's map card could start on one page and paint on the
    // next — printing a cropped map, or none at all. A row-sized grid is a
    // block the print engine moves whole. Sizes stay identical on screen and
    // in print so the preview is the printed page.
    <div className="space-y-3 py-6">
      {rows.map(({ widget, companion }) => {
        const cards = companion ? [widget, companion] : [widget];
        // A widget with no data prints no card, so its map has nothing to sit
        // beside — it goes too.
        const layerCardIds = emptySlugs[widget.slug] ? undefined : layerCardsBySlug[widget.slug];
        const rowHidden = !!emptySlugs[widget.slug] && (!companion || !!emptySlugs[companion.slug]);

        return (
          <div
            key={widget.slug}
            className={cn(
              'grid break-inside-avoid grid-cols-2 items-start gap-3',
              // Every visible child of this row hides itself when empty; the
              // row has to go with them or its `space-y` gap prints on its own.
              rowHidden && 'hidden',
              // The first page is the map and the lead widget; everything else
              // starts on page two, as widget/map pairs. On the row, not the
              // card: a child's break-after does not reliably escape a
              // break-inside-avoid parent.
              widget.slug === LEAD_SLUG && 'print:break-after-page'
            )}
          >
            {cards.map(({ slug, name, applicability }) => {
              const Widget = WIDGETS[slug];
              if (!Widget) return null;

              return (
                <PrintWidgetCard
                  key={slug}
                  slug={slug}
                  isEmpty={!!emptySlugs[slug]}
                  onEmptyChange={handleEmptyChange}
                  name={name}
                  applicability={applicability}
                  fullWidth={FULL_WIDTH_SLUGS.includes(slug)}
                >
                  <Widget />
                </PrintWidgetCard>
              );
            })}
            {layerCardIds && <PrintLayerCard slug={widget.slug} layerIds={layerCardIds} />}
          </div>
        );
      })}
    </div>
  );
};

export default PrintReportPage;
