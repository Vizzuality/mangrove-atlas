'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import LandingNavigation from 'containers/navigation/landing';

import Logo from 'components/logo';
import { Button } from 'components/ui/button';
import Footer from 'containers/auth/footer';

import { setCookie, getCookie } from 'cookies-next';
import { redirect } from 'next/navigation';

import { useRouter } from 'next/navigation';

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-black/85">
    {children}
  </label>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingToken = getCookie('authToken');
    if (!existingToken) return;
    const res = fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to validate token');
      }
      if (res.status === 200) {
        redirect('/');
      }
    });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) router.replace('/');

      const data = await res.json();

      if (data.token) {
        setCookie('authToken', encodeURIComponent(data.token), {
          secure: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          // domain: '.globalmangrovewatch.org',
          path: '/',
        });
        redirect('/');
      }
    } catch (err: any) {
      setError(err?.message || 'There was an error logging in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen bg-white">
      <Logo position="top-left" width={360} />
      <section
        className="flex w-[50%] flex-col justify-center bg-cover bg-right px-4 py-8"
        aria-labelledby="mrt-hero-title"
        style={{
          backgroundImage: 'url(/images/login/image.webp)',
        }}
      >
        <div className="mx-24 max-w-xl space-y-6">
          <h2 id="mrt-hero-title" className="text-5xl font-semibold text-white">
            Welcome to the Mangrove Restoration Tracker Tool
          </h2>
          <p className="text-sm leading-relaxed text-white/90">
            The MRTT is an open-access resource to support restoration practitioners. It provides a
            secure location to hold information across restoration planning, intervention, and
            monitoring.{' '}
            <Link href="/" className="text-white underline hover:text-white/80">
              Learn more
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md px-4 pb-20">
        <LandingNavigation />
        <div className="h-full">
          <div className="flex h-full w-full flex-col justify-center space-y-10">
            <h1 className="font-sans text-[40px] font-light text-brand-800">Log in</h1>
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
                    className="block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-brand-800"
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
                    className="block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-brand-800"
                    required
                  />
                </div>

                {error && <p className="text-right text-sm text-red-400">{error}</p>}

                <Button type="submit" disabled={submitting} className="h-9 w-full font-semibold">
                  {submitting ? 'Submitting…' : 'Log in'}
                </Button>
              </form>

              <div className="divide-text-gray-200 space-y-6 divide-y text-center text-brand-800">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold hover:text-teal-300"
                >
                  Forgot your password?
                </Link>

                <Footer />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
