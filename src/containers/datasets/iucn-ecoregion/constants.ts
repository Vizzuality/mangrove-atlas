// Official IUCN Red List category colors. Collapsed (CO) is ecosystem-only and not in
// the official table, so it uses black like Extinct (EX).
// Source: IUCN Red List Threat Categories – Colour Chart
// https://nc.iucnredlist.org/redlist/resources/files/1759737820-IUCN_Red_List_Category_Colour_Chart.pdf

// Fill colors
export const COLORS = {
  co: '#000000',
  cr: '#D81E05',
  en: '#FC7F3F',
  vu: '#F9E814',
  nt: '#CCE226',
  lc: '#60C659',
  dd: '#D1D1C6',
  ne: '#FFFFFF',
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
