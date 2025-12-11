import { Source, Layer } from 'react-map-gl';

import { activeLayersAtom } from '@/store/layers';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import { useLayers, useSources } from './hooks';

const MangrovesAlertsLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const SOURCES = useSources();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer?.opacity || '1'),
    visibility: activeLayer?.visibility,
  });

  if (!SOURCES || !LAYERS) return null;

  return SOURCES.map((SOURCE) => (
    <Source key={SOURCE.id} {...SOURCE}>
      {SOURCE.id &&
        LAYERS[SOURCE.id]?.map((LAYER) => <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />)}
    </Source>
  ));
};

export default MangrovesAlertsLayer;
