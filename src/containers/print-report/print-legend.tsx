'use client';

import { useMemo } from 'react';

import { useSyncActiveLayers } from '@/store/layers';

import { MAP_LEGENDS } from '@/containers/datasets';
import { LAYERS } from '@/containers/layers/constants';

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
    <div className="absolute right-4 bottom-4 z-50 max-w-72 rounded-2xl bg-white/90 p-4 shadow-md backdrop-blur-sm">
      <h4 className="mb-2 text-xs font-bold tracking-wider text-black/85 uppercase">Legend</h4>
      <div className="space-y-3">
        {legendItems.map((item) => (
          <div key={item.id}>
            <p className="text-xs font-semibold tracking-wider text-black/85 uppercase">
              {item.title}
            </p>
            {item.LegendComponent && (
              <div className="pt-1 pl-1">
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
