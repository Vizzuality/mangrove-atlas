import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const domain = process.env.NODE_ENV === 'production' ? '.globalmangrovewatch.org' : undefined;

export const authOptions: NextAuthOptions = {
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

        // if (!res.ok) return null;

        // const data = await res.json();
        // const token = data?.token;
        // const user = data?.user;

        // if (!token || !user?.id) return null;

        // return { id: String(user.id), email: user.email, accessToken: token } as any;

        const resText = await res.text();

        if (!res.ok) return null;

        let data: any = null;

        try {
          data = JSON.parse(resText);
        } catch {
          return null;
        }

        const headerToken =
          res.headers.get('authorization') ||
          res.headers.get('access-token') ||
          res.headers.get('token');

        const token = data?.token || data?.jwt || headerToken;
        console.log(
          data,
          token,
          headerToken,
          resText,
          '******************************************************************'
        );
        if (!token) return null;

        return { email: credentials.email } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.accessToken = (user as any).accessToken;
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
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
        domain,
      },
    },
  },
};
