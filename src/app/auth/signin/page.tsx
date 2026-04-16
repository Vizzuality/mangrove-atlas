'use client';

import { Suspense } from 'react';

import Login from '@/containers/auth/login-container';

export default function SignInPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
