import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers.find((l) => l.id === 'mangrove_iucn_ecoregion');

  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(datasetsSettings[activeLayer]?.opacity) || 1,
    visibility: activeLayer.visibility,
  });

  useEffect(() => {
    const ids = LAYERS.map((layer) => layer.id);
    onAdd(ids);
    return () => onRemove(ids);
  }, [onAdd, onRemove]);

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesLayer;
