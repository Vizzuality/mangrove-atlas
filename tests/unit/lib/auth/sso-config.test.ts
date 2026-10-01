// @vitest-environment node
import type { NextRequest } from 'next/server';

type SsoConfig = typeof import('@/lib/auth/sso-config');

const MRTT = 'https://mrtt.globalmangrovewatch.org';
const GMW = 'https://www.globalmangrovewatch.org';

// SSO_ALLOWED_ORIGINS is computed at module load from the Zod-validated env,
// so each scenario stubs the env and re-imports a fresh module instance.
async function loadWithEnv(extra: string | undefined): Promise<SsoConfig> {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_MRTT_SITE', `${MRTT}/`);
  vi.stubEnv('NEXTAUTH_URL', GMW);
  if (extra === undefined) {
    vi.stubEnv('SSO_ALLOWED_ORIGINS', '');
  } else {
    vi.stubEnv('SSO_ALLOWED_ORIGINS', extra);
  }
  return import('@/lib/auth/sso-config');
}

function requestWithOrigin(origin?: string): NextRequest {
  const headers = new Headers();
  if (origin) headers.set('origin', origin);
  return { headers } as unknown as NextRequest;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('parseOrigins', () => {
  it('splits, trims, drops empties and normalises to origin', async () => {
    const { parseOrigins } = await loadWithEnv(undefined);
    expect(parseOrigins(' https://a.example/path?x=1 , ,http://localhost:3000/ ')).toEqual([
      'https://a.example',
      'http://localhost:3000',
    ]);
  });

  it('returns [] for undefined/empty input', async () => {
    const { parseOrigins } = await loadWithEnv(undefined);
    expect(parseOrigins(undefined)).toEqual([]);
    expect(parseOrigins('')).toEqual([]);
  });

  it('throws on a malformed entry so misconfiguration fails loudly', async () => {
    const { parseOrigins } = await loadWithEnv(undefined);
    expect(() => parseOrigins('not a url')).toThrow();
  });
});

describe('SSO_ALLOWED_ORIGINS', () => {
  it('always includes MRTT site and NEXTAUTH_URL origins', async () => {
    const { SSO_ALLOWED_ORIGINS } = await loadWithEnv(undefined);
    expect(SSO_ALLOWED_ORIGINS).toEqual([MRTT, GMW]);
  });

  it('appends extra origins from SSO_ALLOWED_ORIGINS and dedupes', async () => {
    const { SSO_ALLOWED_ORIGINS } = await loadWithEnv(
      `https://mrtt-staging.globalmangrovewatch.org, http://localhost:3000/, ${MRTT}/anything`
    );
    expect(SSO_ALLOWED_ORIGINS).toEqual([
      MRTT,
      GMW,
      'https://mrtt-staging.globalmangrovewatch.org',
      'http://localhost:3000',
    ]);
  });
});

describe('isAllowedOrigin / isAllowedRedirectUri', () => {
  it('accepts any path on an allowed origin', async () => {
    const { isAllowedOrigin, isAllowedRedirectUri } = await loadWithEnv('http://localhost:3000');
    expect(isAllowedOrigin(MRTT)).toBe(true);
    expect(isAllowedOrigin(`${MRTT}/`)).toBe(true);
    expect(isAllowedRedirectUri(`${MRTT}/auth/sso-silent?x=1`)).toBe(true);
    expect(isAllowedRedirectUri('http://localhost:3000/auth/sso-silent')).toBe(true);
  });

  it('rejects unknown origins, lookalikes, and garbage', async () => {
    const { isAllowedOrigin, isAllowedRedirectUri } = await loadWithEnv(undefined);
    expect(isAllowedOrigin('https://evil.example')).toBe(false);
    expect(isAllowedOrigin('http://localhost:3000')).toBe(false);
    expect(isAllowedOrigin(`${MRTT}.evil.example`)).toBe(false);
    expect(isAllowedOrigin('http://mrtt.globalmangrovewatch.org')).toBe(false); // scheme matters
    expect(isAllowedOrigin(null)).toBe(false);
    expect(isAllowedOrigin(undefined)).toBe(false);
    expect(isAllowedOrigin('')).toBe(false);
    expect(isAllowedRedirectUri('javascript:alert(1)')).toBe(false);
    expect(isAllowedRedirectUri('not a url')).toBe(false);
  });
});

describe('getSSOCorsHeaders', () => {
  it('echoes an allowed request Origin with credentials', async () => {
    const { getSSOCorsHeaders } = await loadWithEnv('http://localhost:3000');
    const headers = getSSOCorsHeaders(requestWithOrigin('http://localhost:3000'));
    expect(headers).toMatchObject({
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      Vary: 'Origin',
    });
  });

  it('omits Allow-Origin for a disallowed or missing Origin but keeps Vary', async () => {
    const { getSSOCorsHeaders } = await loadWithEnv(undefined);
    for (const req of [requestWithOrigin('https://evil.example'), requestWithOrigin()]) {
      const headers = getSSOCorsHeaders(req);
      expect(headers).not.toHaveProperty('Access-Control-Allow-Origin');
      expect(headers.Vary).toBe('Origin');
    }
  });
});

describe('getSSOFrameAncestorsHeader', () => {
  it("lists 'self' plus every allowed origin", async () => {
    const { getSSOFrameAncestorsHeader } = await loadWithEnv('http://localhost:3000');
    expect(getSSOFrameAncestorsHeader()).toEqual({
      'Content-Security-Policy': `frame-ancestors 'self' ${MRTT} ${GMW} http://localhost:3000;`,
    });
  });
});
