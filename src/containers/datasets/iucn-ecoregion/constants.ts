import { IUCN_COLORS, IUCN_FONT_COLORS } from '@/lib/iucn-colors';

// IUCN RLE risk categories (ecosystems), colors from the shared IUCN palette
const CATEGORY_IDS = ['co', 'cr', 'en', 'vu', 'nt', 'lc', 'dd', 'ne'] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const COLORS = Object.fromEntries(CATEGORY_IDS.map((key) => [key, IUCN_COLORS[key]])) as {
  [K in CategoryId]: (typeof IUCN_COLORS)[K];
};

export const FONT_COLORS = Object.fromEntries(
  CATEGORY_IDS.map((key) => [key, IUCN_FONT_COLORS[key]])
) as Record<CategoryId, string>;

export const LABELS = {
  co: 'Collapsed',
  dd: 'Data Deficient',
  lc: 'Least Concern',
  cr: 'Critically Endangered',
  en: 'Endangered',
  vu: 'Vulnerable',
  nt: 'Near Threatened',
  ne: 'Not Evaluated',
} as const;

// Uppercase keys as emitted by the `overall_assessment` tileset property
export const OVERALL_ASSESSMENT = Object.fromEntries(
  Object.entries(COLORS).map(([key, color]) => [key.toUpperCase(), color])
) as Record<Uppercase<CategoryId>, string>;

export type LegendItem = {
  color: (typeof COLORS)[CategoryId];
  label: (typeof LABELS)[CategoryId];
};

export const LEGEND_ITEMS: LegendItem[] = (Object.keys(COLORS) as CategoryId[]).map((key) => ({
  color: COLORS[key],
  label: LABELS[key],
}));
