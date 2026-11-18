/**
 * Internal placement type of contextual layers. Not shown to users.
 *
 * - detail: more detailed version of data already on the map. Goes on top, or
 *   directly above its `parent` when the parent is active (and the parent,
 *   turned on later, goes directly below it). Movable.
 * - context: adds context around the data (boundaries, other habitats). Goes
 *   below the data layers. Movable.
 * - background: satellite imagery. Always at the bottom, just above the
 *   basemap. Not movable.
 *
 * Map order, top to bottom: detail → data (newest on top) → context → background → basemap.
 */
export type ContextualLayerType = 'detail' | 'context' | 'background';
export type LayerPlacementType = ContextualLayerType | 'data';

export const CONTEXTUAL_LAYER_TYPES: Record<
  string,
  { type: ContextualLayerType; parent?: string }
> = {
  'hi-res-extent': { type: 'detail', parent: 'mangrove_habitat_extent' },
  mangrove_protected_areas: { type: 'context' },
  planet_medres_visual_monthly: { type: 'background' },
  planet_medres_analytic_monthly: { type: 'background' },
};

export const getLayerType = (id: string): LayerPlacementType =>
  CONTEXTUAL_LAYER_TYPES[id]?.type ?? 'data';

export const isContextualLayer = (id: string) => id in CONTEXTUAL_LAYER_TYPES;

export const isBackgroundLayer = (id: string) => getLayerType(id) === 'background';
