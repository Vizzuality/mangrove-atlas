import { Source, Layer, SourceProps } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import { LayerProps } from 'types/layers';

import { useLayer, useSources } from './hooks';

const NetChangeLayer = ({ beforeId, id }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);

  const sources = useSources() satisfies SourceProps[];
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!LAYER || !sources) return null;

  return (
    <>
      {sources.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          <Layer key={`${SOURCE.id}-layer`} {...LAYER} id={SOURCE.id} beforeId={beforeId} />
        </Source>
      ))}
    </>
  );
};

export default NetChangeLayer;
