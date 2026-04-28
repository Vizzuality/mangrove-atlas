import { useSyncActiveLayers } from '@/store/layers';

import chroma from 'chroma-js';

import { COLORS } from './constants';
import { useNationalDashboard } from './hooks';

const colorsScale = chroma.scale(COLORS).colors(COLORS.length);

const NationalDashboardMapLegend = () => {
  const [activeLayers] = useSyncActiveLayers();
  const { data } = useNationalDashboard();
  const ISO = data?.locationIso;
  const layer = activeLayers?.find(({ id }) => id === `mangrove_national_dashboard_layer_${ISO}`);
  const sources = data?.data[0]?.sources;
  const color = colorsScale.filter((c, i) => i === layer?.settings?.layerIndex) as string[];

  return (
    <div className="flex w-full flex-col justify-between space-y-2 font-sans text-black/60">
      {sources?.map(({ source }) => {
        return (
          <div key={source} className="flex items-start">
            <div
              style={{ backgroundColor: color[0] }}
              className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md text-sm"
            />
            <div className="flex flex-col items-start text-sm">
              <p>{source}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NationalDashboardMapLegend;
