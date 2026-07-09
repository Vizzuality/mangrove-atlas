// Predefined role options for the "What is your role?" profile field (GMW-1042).
// There is no API endpoint exposing this list — the backend validates against the
// same enum, so keep values in sync with the backend when the list changes.
// `label` is what the user sees; `value` is the enum persisted by the API.
export const ROLE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Scientist', value: 'scientist' },
  { label: 'Academic', value: 'academic' },
  { label: 'NGO', value: 'ngo' },
  { label: 'Government / Policy', value: 'government_policy' },
  { label: 'Natural Resource Managers', value: 'natural_resource_manager' },
  { label: 'Industry', value: 'industry' },
  { label: 'Education (student or educator)', value: 'education' },
  { label: 'Legal / Enforcement', value: 'legal_enforcement' },
  { label: 'Other', value: 'other' },
];

export const OTHER_ROLE_VALUE = 'other';
