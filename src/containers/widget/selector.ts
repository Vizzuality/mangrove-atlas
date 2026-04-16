import { useSyncActiveLayers } from '@/store/layers';

import type { WidgetSlugType, ContextualBasemapsId } from 'types/widget';

export function useIsLayerActive(
  widgetId: WidgetSlugType | ContextualBasemapsId | 'custom-area'
): boolean {
  const [activeLayers] = useSyncActiveLayers();
  return activeLayers?.some((layer) => layer.id === widgetId) ?? false;
}
