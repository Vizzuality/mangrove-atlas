'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Button } from 'components/ui/button';
import Footer from '@/containers/auth/footer';

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-black/85">
    {children}
  </label>
);

export function LoginForm() {
  const router = useRouter();
  const { replace, query } = router;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { status, update } = useSession();

  // If already signed in, bounce away from /auth/signin
  useEffect(() => {
    if (status === 'authenticated') {
      replace('/');
    }
  }, [status, replace]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!result?.ok) {
        setError(
          result?.error && result.error !== 'CredentialsSignin'
            ? result.error
            : 'Invalid credentials'
        );
        return;
      }

      // await replace(result.url ?? '/');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'There was an error logging in.');
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading' || status === 'authenticated') {
    return null;
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm ring-0 outline-none placeholder:text-zinc-400"
            required
          />
        </div>

        {error && <p className="text-right text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={submitting} className="h-9 w-full font-semibold">
          {submitting ? 'Submitting…' : 'Log in'}
        </Button>
      </form>

      <div className="text-brand-800 w-full space-y-6 text-center">
        <Link href="/auth/forgot-password" className="text-sm font-semibold hover:text-teal-300">
          Forgot your password?
        </Link>
        <div className="my-6 h-[0.5px] w-full bg-gray-200" />

        <Footer />
      </div>
    </div>
  );
}

export default LoginForm;
