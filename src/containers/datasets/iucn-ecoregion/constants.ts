import { IUCN_COLORS } from '@/lib/iucn-colors';

// Fill colors — official IUCN palette, see `@/lib/iucn-colors`
export const COLORS = {
  co: IUCN_COLORS.ex,
  cr: IUCN_COLORS.cr,
  en: IUCN_COLORS.en,
  vu: IUCN_COLORS.vu,
  nt: IUCN_COLORS.nt,
  lc: IUCN_COLORS.lc,
  dd: IUCN_COLORS.dd,
  ne: IUCN_COLORS.ne,
} as const;

export type CategoryId = keyof typeof COLORS;

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
