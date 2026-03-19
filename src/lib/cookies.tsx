'use server';
import { cookies } from 'next/headers';

export async function setSecureCookie(formData: FormData) {
  const cookieStore = await cookies();
  cookieStore.set('sessionToken', 'secure-token', {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}
