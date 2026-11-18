import {
  CONTEXTUAL_LAYER_TYPES,
  getLayerType,
  isBackgroundLayer,
} from '@/containers/layers/contextual-types';

type WithId = { id: string };

/** Moves background layers to the end, keeping relative order otherwise. */
export function normalizeLayers<T extends WithId>(layers: T[]): T[] {
  const rest = layers.filter((l) => !isBackgroundLayer(l.id));
  const background = layers.filter((l) => isBackgroundLayer(l.id));
  return [...rest, ...background];
}

/**
 * Adds a layer where its type says it belongs (index 0 = top of the map).
 * Any existing entry with the same id is replaced, so a layer turned on from
 * several places only ever has one entry.
 */
export function insertLayer<T extends WithId>(layers: T[], newLayer: T): T[] {
  const type = getLayerType(newLayer.id);
  const current = layers.filter((l) => l.id !== newLayer.id);

  switch (type) {
    case 'background': {
      // Only one background at a time (Planet visual / analytic are exclusive).
      const rest = current.filter((l) => !isBackgroundLayer(l.id));
      return [...rest, newLayer];
    }
    case 'context': {
      const idx = current.findIndex((l) => {
        const t = getLayerType(l.id);
        return t === 'context' || t === 'background';
      });
      const at = idx === -1 ? current.length : idx;
      return [...current.slice(0, at), newLayer, ...current.slice(at)];
    }
    case 'detail': {
      const parent = CONTEXTUAL_LAYER_TYPES[newLayer.id]?.parent;
      const parentIdx = parent ? current.findIndex((l) => l.id === parent) : -1;
      // Directly on top of its parent when the parent is active, otherwise on top.
      const at = parentIdx === -1 ? 0 : parentIdx;
      return [...current.slice(0, at), newLayer, ...current.slice(at)];
    }
    default: {
      // A parent turned on after its detail layer goes directly below it.
      const detailIdx = current.findIndex(
        (l) => CONTEXTUAL_LAYER_TYPES[l.id]?.parent === newLayer.id
      );
      if (detailIdx !== -1) {
        return [...current.slice(0, detailIdx + 1), newLayer, ...current.slice(detailIdx + 1)];
      }
      // Newest data layer goes on top of the data block, below leading detail layers.
      let at = 0;
      while (at < current.length && getLayerType(current[at].id) === 'detail') at += 1;
      return [...current.slice(0, at), newLayer, ...current.slice(at)];
    }
  }
}

/** Removes the layer if active, otherwise inserts it by type. */
export function toggleLayer<T extends WithId>(layers: T[], layer: T): T[] {
  return layers.some((l) => l.id === layer.id)
    ? layers.filter((l) => l.id !== layer.id)
    : insertLayer(layers, layer);
}

/**
 * Applies a new order for a subset of layers (the legend rows) while keeping
 * every other layer in its slot. Background layers stay pinned at the end.
 */
export function reorderSubset<T extends WithId>(layers: T[], order: string[]): T[] {
  const orderSet = new Set(order);
  const byId = new Map(layers.map((l) => [l.id, l]));
  const queue = order.map((id) => byId.get(id)).filter(Boolean) as T[];
  const merged = layers.map((l) => (orderSet.has(l.id) ? (queue.shift() as T) : l));
  return normalizeLayers(merged);
}
