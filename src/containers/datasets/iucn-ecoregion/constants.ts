// IUCN RLE risk category scheme (fill)
export const COLORS = {
  co: '#000000',
  cr: '#FF0000',
  en: '#FFA500',
  vu: '#FFFF00',
  nt: '#ADFF2F',
  lc: '#008000',
  dd: '#808080',
  ne: '#CCCCCC',
} as const;

// IUCN RLE risk category scheme (text on top of the fill)
export const FONT_COLORS: Record<keyof typeof COLORS, string> = {
  co: '#FFFFFF',
  cr: '#FFFFFF',
  en: '#000000',
  vu: '#000000',
  nt: '#000000',
  lc: '#FFFFFF',
  dd: '#FFFFFF',
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

export type CategoryId = keyof typeof COLORS;

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
