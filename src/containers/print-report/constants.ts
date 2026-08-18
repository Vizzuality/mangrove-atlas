/** Opens the report: the big map at the top, then this widget under it. */
export const LEAD_SLUG = 'mangrove_habitat_extent';

/**
 * The opening map shows the mangrove extent and nothing else — it is the
 * report's subject. Every other active layer is drawn on its own small map
 * beside the widget that owns it, so the lead widget never gets one.
 */
export const LEAD_MAP_LAYER_IDS = ['mangrove_habitat_extent'];

/**
 * Cards spanning the full 277mm page width; every other widget takes half.
 * Restoration earns it by laying its five sections out in two columns — at half
 * width those columns would be ~65mm, narrower than any of them is built for.
 * Habitat extent reads directly under the opening map, across the same width.
 */
export const FULL_WIDTH_SLUGS: string[] = [LEAD_SLUG, 'mangrove_restoration'];

/**
 * Every layer card is a live Mapbox instance and browsers cap concurrent WebGL
 * contexts (Chrome drops the oldest past ~16). The report's own map plus this
 * many is a safe ceiling; widgets beyond it keep their card without a map.
 */
export const MAX_LAYER_CARDS = 10;
