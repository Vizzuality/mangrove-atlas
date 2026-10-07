export const COLORS = {
  cr: '#EE4D5A',
  en: '#F97B57',
  vu: '#F3AD6A',
  nt: '#ECDA9A',
  lc: '#B4DCAA',
  dd: '#ECECEF',
  ne: '#CCCCCC',
} as const;

export const LABELS = {
  dd: 'Data Deficient',
  lc: 'Least Concern',
  cr: 'Critically Endangered',
  en: 'Endangered',
  vu: 'Vulnerable',
  nt: 'Near Threatened',
  ne: 'Not Evaluated',
} as const;

export type CategoryId = keyof typeof COLORS;

// Uppercase keys as emitted by the `overall_assessment` tileset property
export const OVERALL_ASSESSMENT = Object.fromEntries(
  Object.entries(COLORS).map(([key, color]) => [key.toUpperCase(), color])
) as Record<Uppercase<CategoryId>, string>;

export const LEGEND_ITEMS = (Object.keys(COLORS) as CategoryId[]).map((key) => ({
  color: COLORS[key],
  label: LABELS[key],
}));
