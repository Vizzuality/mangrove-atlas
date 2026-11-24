'use client';

import { Suspense } from 'react';

import { useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { usePutResetPassword } from '@/containers/auth/hooks';
import LandingNavigation from '@/containers/navigation/landing';

import Logo from 'components/logo';
import { Button } from 'components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

const formSchema = z
  .object({
    password: z
      .string()
      .nonempty({ message: 'Please enter your password' })
      .min(6, { message: 'Please enter a password with at least 6 characters' }),
    password_confirmation: z
      .string()
      .nonempty({ message: 'Confirm password' })
      .min(6, { message: 'Please enter a password with at least 6 characters' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data['password_confirmation']) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      });
    }
  });

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const updatePassword = usePutResetPassword();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const token = searchParams.get('token');

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;
    form.clearErrors();
    updatePassword.mutate(
      {
        user: {
          password: values.password,
          password_confirmation: values.password_confirmation,
          reset_password_token: token,
        },
      },
      {
        onSuccess: () => {
          router.push('/auth/signin');
        },
        onError: (error: any) => {
          const errors = error?.response?.data?.errors;
          // Devise: an expired/used link comes back as reset_password_token errors.
          if (errors?.reset_password_token?.length) {
            form.setError('root', {
              type: 'server',
              message: 'This reset link has expired or was already used. Request a new one.',
            });
            return;
          }
          if (errors?.password?.[0]) {
            form.setError('password', {
              type: 'server',
              message: `Password ${errors.password[0]}`,
            });
            return;
          }
          form.setError('password_confirmation', {
            type: 'manual',
            message: 'Could not reset password. Please try again.',
          });
        },
      }
    );
  }

  return (
    <div className="relative flex min-h-screen bg-white">
      <Logo position="top-left" width={360} className="z-10" />
      {/* Empty decorative panel — see the signup page. */}
      <div
        aria-hidden="true"
        className="flex w-[50%] flex-col justify-center bg-cover bg-right px-4 py-8"
        style={{
          backgroundImage: 'url(/images/login/image.webp)',
        }}
      />

      <div className="mx-auto w-full max-w-md px-4 pb-20">
        <LandingNavigation />
        {/* See login-container: main is the form column, not the whole screen. */}
        <main id="main-content" className="flex h-full w-full flex-col justify-center space-y-10">
          <h1 className="text-brand-800 font-sans text-[40px] font-light">Reset Password</h1>
          <div className="space-y-6">
            {!token && (
              <p role="alert" className="text-sm text-red-500">
                This reset link is invalid or incomplete. Use the link from your email, or{' '}
                <Link href="/auth/signin" className="underline">
                  go back to sign in
                </Link>{' '}
                to request a new one.
              </p>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <fieldset className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold" required>
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            {...field}
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-black/60"
                            placeholder="Password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold" required>
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            {...field}
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-black/60"
                            placeholder="Password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
                {form.formState.errors.root?.message && (
                  <p role="alert" className="text-sm text-red-500">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={!token || updatePassword.isPending}
                  className="h-9 w-full font-semibold"
                >
                  Reset Password
                </Button>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
