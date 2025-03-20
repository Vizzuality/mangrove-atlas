export type Period = 'annual' | '25_year' | '100_year';
type Label = {
  axis: string;
  large: string;
  short: string;
};

export const LABELS: Record<Period, Label> = {
  annual: {
    axis: 'Annual',
    large: 'Annually',
    short: 'Average annual storm',
  },
  '25_year': {
    axis: '25 Year',
    large: 'Once every 25 years',
    short: '25-year storm',
  },
  '100_year': {
    axis: '100 Year',
    large: 'Once every 100 years',
    short: '100-year storm',
  },
};

export const UNITS_LABELS = {
  people: 'individuals',
  usd: '$',
  km2: 'km²',
};
