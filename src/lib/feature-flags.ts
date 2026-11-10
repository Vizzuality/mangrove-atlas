import { env } from 'env.mjs';

// Per-environment defaults. NEXT_PUBLIC_FEATURED_FLAGS (JSON, e.g. '{"default-view":true}')
// overrides any of them without a code change.
const DEFAULTS = {
  'default-view': env.NEXT_PUBLIC_ENVIRONMENT !== 'production',
} as const;

export type FeatureFlag = keyof typeof DEFAULTS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean =>
  env.NEXT_PUBLIC_FEATURED_FLAGS[flag] ?? DEFAULTS[flag];
