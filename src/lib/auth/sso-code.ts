import { encode, decode } from 'next-auth/jwt';

const SSO_CODE_MAX_AGE = 30; // 30 seconds

/**
 * Generate a short-lived, signed & encrypted SSO authorization code
 * containing the backend API token. Uses next-auth's JWE under the hood.
 */
export async function generateSSOCode(backendToken: string): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('SSO service is not properly configured');

  return encode({
    secret,
    token: { backendToken },
    maxAge: SSO_CODE_MAX_AGE,
  });
}

/**
 * Verify and decrypt an SSO authorization code.
 * Returns the backend token if valid, null if expired/tampered.
 */
export async function verifySSOCode(code: string): Promise<string | null> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  try {
    const decoded = await decode({ secret, token: code });
    if (!decoded?.backendToken) return null;
    return decoded.backendToken as string;
  } catch {
    return null;
  }
}
