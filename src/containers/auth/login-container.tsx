'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import LandingNavigation from '@/containers/navigation/landing';
import Logo from 'components/logo';
import { Button } from 'components/ui/button';
import Footer from '@/containers/auth/footer';
import SuccessAlert from 'components/auth/email-alert';
import LoginForm from './login-form';

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-black/85">
    {children}
  </label>
);

export default function LoginPage() {
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
    <div className="relative flex min-h-screen bg-white">
      <Logo position="top-left" width={360} />

      <section
        className="flex w-[50%] flex-col justify-center bg-cover bg-right px-4 py-8"
        aria-labelledby="mrt-hero-title"
        style={{ backgroundImage: 'url(/images/login/image.webp)' }}
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
            <h1 className="text-brand-800 font-sans text-[40px] font-light">Log in</h1>

            {query.verified === 'pending' && (
              <SuccessAlert message="A verification email has been sent to your email address. Please check your inbox to verify your account." />
            )}

            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
