import { useSyncActiveLayers } from '@/store/layers';

import chroma from 'chroma-js';

import { COLORS } from './constants';

const NATIONAL_LAYER_PREFIX = 'mangrove_national_dashboard_layer_';

const NationalDashboardMapLegend = () => {
  const [activeLayers] = useSyncActiveLayers();

  const nationalLayers = (activeLayers ?? []).filter(
    (layer) => typeof layer.id === 'string' && layer.id.startsWith(NATIONAL_LAYER_PREFIX)
  );

  if (nationalLayers.length === 0) return null;

  const maxIndex = nationalLayers.reduce(
    (max, l) => Math.max(max, (l.settings?.layerIndex as number) ?? 0),
    0
  );
  const palette = chroma.scale(COLORS).colors(Math.max(maxIndex + 1, COLORS.length));

  return (
    <ul
      role="list"
      className="flex w-full flex-col justify-between space-y-2 font-sans text-black/60"
    >
      {nationalLayers.map((layer) => {
        const layerIndex = (layer.settings?.layerIndex as number) ?? 0;
        const color = palette[layerIndex] ?? palette[0];
        const name = (layer.settings?.name as string) ?? '';
        return (
          <li key={layer.id} className="flex items-start">
            <div
              style={{ backgroundColor: color }}
              className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md text-sm"
              aria-hidden="true"
            />
            <div className="flex flex-col items-start text-sm">
              <p>{name}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default NationalDashboardMapLegend;
