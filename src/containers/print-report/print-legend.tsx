'use client';

import { useMemo } from 'react';

import cn from '@/lib/classnames';

import { useSyncActiveLayers } from '@/store/layers';

import { MAP_LEGENDS } from '@/containers/datasets';
import { LAYERS } from '@/containers/layers/constants';

import { WIDGET_SUBTITLE_STYLE } from '@/styles/widgets';

const PrintLegend = () => {
  const [activeLayers] = useSyncActiveLayers();

  const legendItems = useMemo(() => {
    if (!activeLayers?.length) return [];
    return activeLayers
      .filter((l) => !l.id.includes('planet') && l.id !== 'custom-area')
      .map((l) => {
        const legendKey = Object.keys(MAP_LEGENDS).find(
          (k) =>
            (l.id?.startsWith('mangrove_national_dashboard') && l.id?.includes(k)) || l.id === k
        );
        const LegendComponent = legendKey ? (MAP_LEGENDS[legendKey] as React.ElementType) : null;
        const layerMeta = LAYERS.find((w) => w.id === l.id);
        const title = l.id.includes('mangrove_national_dashboard_layer')
          ? 'National Dashboard'
          : layerMeta?.name;
        if (!title && !l.id.includes('mangrove_national_dashboard_layer')) return null;
        return { id: l.id, title, LegendComponent };
      })
      .filter(Boolean);
  }, [activeLayers]);

  if (!legendItems.length) return null;

  return (
    // `print-report-legend` scales the layer legends down as a block: each one
    // sets its own font sizes, so the report overrides them in one rule rather
    // than editing every dataset's legend (see globals.css).
    <div className="print-report-legend mt-3 break-inside-avoid">
      <h2 className={cn(WIDGET_SUBTITLE_STYLE, 'mb-2 text-[10px] text-black/85')}>Legend</h2>
      <div className="grid grid-flow-row-dense grid-cols-2 gap-x-8 gap-y-2">
        {legendItems.map((item) => (
          <div key={item.id} className="min-w-0">
            <p className="text-[10px] font-semibold tracking-wider text-black/85 uppercase">
              {item.title}
            </p>
            {item.LegendComponent && (
              <div className="pt-1">
                <item.LegendComponent />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintLegend;
