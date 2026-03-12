// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Server-side Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    ESLINT_USE_FLAT_CONFIG: z.coerce.boolean().default(true),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    AUTH_API_URL: z.string().url(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type-errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_MRTT_SITE: z.string().url(),
    NEXT_PUBLIC_AUTH_URL: z.string().url(),
    NEXT_PUBLIC_ANALYSIS_API_URL: z.string().url(),
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
    NEXT_PUBLIC_PLANET_API_KEY: z.string(),
    NEXT_PUBLIC_TRANSIFEX_API_KEY: z.string(),
    NEXT_PUBLIC_SMTP_ADDRESS: z.string(),
    NEXT_PUBLIC_SMTP_PASSWORD: z.string(),
    NEXT_PUBLIC_SMTP_PORT: z.coerce.number(),
    NEXT_PUBLIC_SMTP_USER_NAME: z.string(),
    NEXT_PUBLIC_GA_ID: z.string(),
    NEXT_PUBLIC_FEATURED_FLAGS: z
      .string()
      .transform((val) => {
        try {
          return JSON.parse(val);
        } catch {
          return {};
        }
      })
      .pipe(z.record(z.string(), z.boolean()))
      .default('{}'),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type-errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MRTT_SITE: process.env.NEXT_PUBLIC_MRTT_SITE,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_ANALYSIS_API_URL: process.env.NEXT_PUBLIC_ANALYSIS_API_URL,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_PLANET_API_KEY: process.env.NEXT_PUBLIC_PLANET_API_KEY,
    NEXT_PUBLIC_TRANSIFEX_API_KEY: process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY,
    ESLINT_USE_FLAT_CONFIG: process.env.ESLINT_USE_FLAT_CONFIG,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_API_URL: process.env.AUTH_API_URL,
    NEXT_PUBLIC_SMTP_ADDRESS: process.env.NEXT_PUBLIC_SMTP_ADDRESS,
    NEXT_PUBLIC_SMTP_PASSWORD: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
    NEXT_PUBLIC_SMTP_PORT: process.env.NEXT_PUBLIC_SMTP_PORT,
    NEXT_PUBLIC_SMTP_USER_NAME: process.env.NEXT_PUBLIC_SMTP_USER_NAME,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_FEATURED_FLAGS: process.env.NEXT_PUBLIC_FEATURED_FLAGS,
  },
});

export default env;
