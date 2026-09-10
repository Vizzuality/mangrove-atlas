import type { WidgetTypes } from 'types/widget';

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

/** The app widget that the report replaces with the three cards below. */
export const COASTAL_PROTECTION_SLUG = 'mangrove_flood_protection';

/**
 * The app shows coastal protection as one widget with its three indicators
 * stacked inside — one shared card, one entry in the sidebar. On paper each
 * indicator has its own layer to sit beside, so the report splits the widget
 * into three, each declaring the single layer it owns. Location types,
 * applicability, and categories are the parent widget's.
 */
export const COASTAL_PROTECTION_PRINT_WIDGETS: WidgetTypes[] = [
  {
    name: 'Coastal Protection: Area',
    slug: 'mangrove_coastal_protection_area',
    locationType: ['wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['mangrove_coastal_protection_area'],
  },
  {
    name: 'Coastal Protection: Population',
    slug: 'mangrove_coastal_protection_population',
    locationType: ['wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['mangrove_coastal_protection_population'],
  },
  {
    name: 'Coastal Protection: Stock',
    slug: 'mangrove_coastal_protection_stock',
    locationType: ['wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['mangrove_coastal_protection_stock'],
  },
];
