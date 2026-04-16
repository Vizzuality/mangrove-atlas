'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useSession } from 'next-auth/react';

import LandingNavigation from '@/containers/navigation/landing';

import FooterSignup from '@/components/auth/footer-signup';
import ForgotPassword from '@/components/auth/forgot-password';
import SuccessAlert from 'components/auth/email-alert';
import Logo from 'components/logo';

import LoginForm from './login-form';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const session = useSession();
  const status = session?.status;

  // If already signed in, bounce away from /auth/signin
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

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
        <div className="mx-24 max-w-xl space-y-6 text-white">
          <h2 id="mrt-hero-title" className="text-6xl font-light">
            Welcome to Global Mangrove Watch
          </h2>
          <p className="text-sm leading-relaxed text-white">
            A coordinated effort across sectors and geographies will accomplish more, faster. Global
            Mangrove Watch is the evidence base informing the Global Mangrove Alliance, a
            collaboration of organisations working to halt mangrove loss, restore half, and double
            protection by 2030.{' '}
            <Link
              href="https://www.mangrovealliance.org/global-mangrove-watch"
              className="hover:underline"
            >
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

            {searchParams.get('verified') === 'pending' && (
              <SuccessAlert message="A verification email has been sent to your email address. Please check your inbox to verify your account." />
            )}

            <div className="space-y-6">
              <LoginForm />
              <div className="text-brand-800 w-full text-center">
                <ForgotPassword />
                <div className="my-4 h-[0.5px] w-full bg-gray-200" />
                <FooterSignup />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
