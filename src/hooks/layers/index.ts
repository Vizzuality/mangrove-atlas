import { trackEvent } from '@/lib/analytics/ga';

import { Layer } from 'types/layers';

export function updateLayers(newLayer: Layer, activeLayers: Layer[]): Layer[] {
  const { id } = newLayer;
  const index = activeLayers?.findIndex((layer) => layer.id === id);

  if (index !== -1) {
    return [...activeLayers?.slice(0, index), ...activeLayers?.slice(index + 1)];
  }

  trackEvent(`Add layer - ${id}`, {
    category: 'Layers',
    action: 'Toggle',
    label: `Add layer - ${id}`,
  });
  return [newLayer, ...activeLayers];
}
