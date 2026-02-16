import { useEffect, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';
import { useRecoilValue } from 'recoil';

import { activeLayersAtom } from '@/store/layers';
import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesAlertsLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers?.find((l) => l.id === id);

  const source = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  useEffect(() => {
    const ids = LAYERS.map((l) => l.id);
    onAdd(ids);
    return () => onRemove(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAdd, onRemove]);

  
  if (!source || !LAYERS) return null;

  return (
    <Source key={source.id} {...source}>
      {LAYERS.map((layer) => (
        <Layer key={layer.id} {...layer} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesAlertsLayer;
