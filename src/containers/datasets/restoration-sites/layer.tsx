import { useEffect, useMemo } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useRecoilValue } from 'recoil';

import { activeLayersAtom } from 'store/layers';
import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesRestorationSitesLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers?.find((l) => l.id.includes('mangrove_rest_sites'));

  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  const ids = useMemo(() => LAYERS.map((layer) => layer.id), [LAYERS]);

  useEffect(() => {
    if (!!ids.length) {
      onAdd(ids);
      return () => onRemove(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAdd, onRemove]);

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source key={SOURCE.id} {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesRestorationSitesLayer;
