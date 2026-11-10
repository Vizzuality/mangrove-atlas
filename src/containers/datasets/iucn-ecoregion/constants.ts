import { IUCN_COLORS } from '@/lib/iucn-colors';

// Red List of Ecosystems categories, in legend order. Fill colours come from the official
// IUCN palette in `@/lib/iucn-colors`.
export const CATEGORY_IDS = ['co', 'cr', 'en', 'vu', 'nt', 'lc', 'dd', 'ne'] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const isCategoryId = (id?: string): id is CategoryId =>
  !!id && (CATEGORY_IDS as readonly string[]).includes(id);

// Text colors on top of each fill (chosen for contrast; not part of the official table)
export const FONT_COLORS: Record<CategoryId, string> = {
  co: '#FFFFFF',
  cr: '#FFFFFF',
  en: '#000000',
  vu: '#000000',
  nt: '#000000',
  lc: '#000000',
  dd: '#000000',
  ne: '#000000',
};

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
  CATEGORY_IDS.map((key) => [key.toUpperCase(), IUCN_COLORS[key]])
) as Record<Uppercase<CategoryId>, string>;

export type LegendItem = {
  color: (typeof IUCN_COLORS)[CategoryId];
  label: (typeof LABELS)[CategoryId];
};

export const LEGEND_ITEMS: LegendItem[] = CATEGORY_IDS.map((key) => ({
  color: IUCN_COLORS[key],
  label: LABELS[key],
}));
