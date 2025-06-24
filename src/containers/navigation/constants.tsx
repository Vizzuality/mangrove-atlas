import type { Category } from 'types/category';

const CATEGORY_OPTIONS: {
  value: Category | 'custom';
  label: string;
}[] = [
  { value: 'distribution_and_change', label: 'Distribution & Change' },
  {
    value: 'restoration_and_conservation',
    label: 'Restoration & Conservation',
  },
  { value: 'climate_and_policy', label: 'Climate & Policy' },
  { value: 'ecosystem_services', label: 'Ecosystem Services' },
  { value: 'contextual_layers', label: 'Contextual layers' },
  { value: 'custom', label: 'Custom' },
] satisfies { value: Category | 'custom'; label: string }[];

export const STYLES = {
  'icon-wrapper': 'flex h-10.5 w-10.5 flex-col items-center justify-center text-brand-800',
};

export default CATEGORY_OPTIONS;
