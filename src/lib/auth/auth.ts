import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    accessToken?: string;
    name?: string | null;
    email?: string | null;
    organization?: string | null;
    roles?: string[];
    otherRole?: string | null;
  }
}

declare module 'next-auth' {
  interface User {
    accessToken: string;
    organization?: string | null;
    roles?: string[];
    other_role?: string | null;
    id?: string;
  }
  interface Session {
    user: User;
  }
}

const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
const cookieDomain = isProd ? '.globalmangrovewatch.org' : undefined;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production',
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${process.env.AUTH_API_URL}/users/sign_in`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            user: { email: credentials.email, password: credentials.password },
          }),
        });

        const resText = await res.text();

        if (!res.ok) return null;

        let data: any = null;

        try {
          data = JSON.parse(resText);
        } catch {
          console.error('Failed to parse response:', resText);
          return null;
        }

        const token = data?.token;

        if (!token) return null;

        return {
          id: credentials.email,
          email: credentials.email,
          name: data?.username || credentials.email,
          organization: data?.organization || null,
          roles: data?.user_roles ?? [],
          other_role: data?.user_role_other || null,
          accessToken: token,
        };
      },
    }),

    // SSO: token-based provider for restoring sessions from the shared httpOnly cookie.
    // Used when a user logged in on MRTT visits GMW.
    CredentialsProvider({
      id: 'shared-token',
      name: 'SharedToken',
      credentials: {
        token: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null;

        const res = await fetch(`${process.env.AUTH_API_URL}/users/current_user`, {
          headers: { Authorization: `Bearer ${credentials.token}` },
        });

        if (!res.ok) return null;

        const payload = await res.json();
        const data = payload?.user ?? payload;

        return {
          id: data.email,
          email: data.email,
          name: data.name || data.username,
          organization: data.organization || null,
          roles: data.user_roles ?? [],
          other_role: data.user_role_other || null,
          accessToken: credentials.token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.organization = user.organization;
        token.roles = user.roles ?? [];
        token.otherRole = user.other_role;
        token.email = user.email;
      }

      // Reflect profile edits (name/organization/roles) into the JWT without a
      // re-login, so the account form shows saved values when reopened.
      if (trigger === 'update' && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.email !== undefined) token.email = session.email;
        if (session.organization !== undefined) token.organization = session.organization;
        if (session.roles !== undefined) token.roles = session.roles;
        if (session.other_role !== undefined) token.otherRole = session.other_role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = session.user ?? ({} as any);
      if (token.userId) (session.user as any).id = token.userId as string;
      if (token.accessToken) (session.user as any).accessToken = token.accessToken as string;
      if (token.organization) (session.user as any).organization = token.organization as string;
      (session.user as any).roles = (token.roles as string[]) ?? [];
      (session.user as any).other_role = (token.otherRole as string) ?? null;
      if (token.name) session.user.name = token.name as string;
      if (token.email) session.user.email = token.email as string;

      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      },
    },
    csrfToken: {
      name: isProd ? '__Secure-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: isProd,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      },
    },
    callbackUrl: {
      name: isProd ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: isProd,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      },
    },
  },
};
