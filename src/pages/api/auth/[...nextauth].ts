import NextAuth, { type NextAuthOptions, type User, type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    accessToken?: string;
    name?: string | null;
    email?: string | null;
  }
}

const domain = process.env.NODE_ENV === 'production' ? '.globalmangrovewatch.org' : undefined;

declare module 'next-auth' {
  interface User {
    accessToken: string;
    organization?: string;
    id?: string;
  }
  interface Session {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
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
          accessToken: token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.organization = user.organization;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = session.user ?? ({} as any);
      if (token.userId) (session.user as any).id = token.userId as string;
      if (token.accessToken) (session.user as any).accessToken = token.accessToken as string;
      if (token.organization) (session.user as any).organization = token.organization as string;
      if (token.name) session.user.name = token.name as string;
      if (token.email) session.user.email = token.email as string;

      return session;
    },
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',

        ...(process.env.NODE_ENV === 'production' && domain ? { domain } : {}),
      },
    },
  },
};

export default NextAuth(authOptions);
