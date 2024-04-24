import type { Visibility } from 'mapbox-gl';

import type { WidgetSlugType, ContextualBasemapsId } from 'types/widget';

type Layer = {
  id: WidgetSlugType | ContextualBasemapsId | 'custom-area';
  opacity: string;
  visibility: Visibility;
  settings?: {
    name?: string;
    source?: string;
    source_layer?: string;
    location?: string;
    layerIndex?: number;
    date?: string;
    [key: string]: string | number;
  };
};

export function updateLayers(activeLayers: Layer[], newLayer: Layer): Layer[] {
  const { id } = newLayer;
  const index = activeLayers.findIndex((layer) => layer.id === id);
  const hasNationalDashboard = id.includes('national_dashboard');
  const nationalDashboardIndex = activeLayers.findIndex((layer) =>
    layer.id.includes('national_dashboard')
  );

  if (index !== -1) {
    // Delete the layer if it already exists by creating a new array without that layer
    return [...activeLayers.slice(0, index), ...activeLayers.slice(index + 1)];
  } else if (hasNationalDashboard && nationalDashboardIndex !== -1) {
    // Replace the national_dashboard layer with the new layer by creating a new array
    return activeLayers.map((layer, idx) => (idx === nationalDashboardIndex ? newLayer : layer));
  } else {
    // Adds the new layer to the list by creating a new array with the new layer
    return [...activeLayers, newLayer];
  }
}
