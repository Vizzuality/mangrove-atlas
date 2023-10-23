import { Source, Layer } from 'react-map-gl';

import { habitatExtentSettings } from 'store/widgets/habitat-extent';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import {} from './hooks';
import { useLayers, useSource, useMangroveHabitatExtent } from './hooks';

const MangrovesHabitatExtentLayer = ({ beforeId, id }: LayerProps) => {
  const year = useRecoilValue(habitatExtentSettings);
  const { data } = useMangroveHabitatExtent({ year });
  const years = data?.years?.sort() || [];

  const currentYear = year || years[years.length - 1];

  const SOURCE = useSource();
  const LAYERS = useLayers({ year: currentYear, id });
  if (!SOURCE || !LAYERS) return null;
  return (
    <Source key={SOURCE.id} {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesHabitatExtentLayer;
