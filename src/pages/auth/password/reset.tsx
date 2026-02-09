'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LandingNavigation from '@/containers/navigation/landing';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

import Logo from 'components/logo';
import { Button } from 'components/ui/button';
import { usePutResetPassword } from '@/containers/auth/hooks';
import { useRouter } from 'next/router';
import { ro } from 'date-fns/locale';

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
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      });
    }
  });

export default function ResetPasswordPage() {
  const updatePassword = usePutResetPassword();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors('password');
    updatePassword.mutate(
      {
        user: {
          password: values.password,
          password_confirmation: values.password_confirmation,
          reset_password_token: router.query.token as string,
        },
      },
      {
        onSuccess: () => {
          router.push('/auth/signin');
        },
        onError: (e) => {
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
      <Logo position="top-left" width={360} />
      <section
        className="flex w-[50%] flex-col justify-center bg-cover bg-right px-4 py-8"
        aria-labelledby="mrt-hero-title"
        style={{
          backgroundImage: 'url(/images/login/image.webp)',
        }}
      />

      <section className="mx-auto w-full max-w-md px-4 pb-20">
        <LandingNavigation />
        <div className="flex h-full w-full flex-col justify-center space-y-10">
          <h1 className="text-brand-800 font-sans text-[40px] font-light">Reset Password</h1>
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <fieldset className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
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
                        <FormLabel className="text-xs font-semibold">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password_confirmation"
                            {...field}
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                            placeholder="Password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
                <Button type="submit" disabled={false} className="h-9 w-full font-semibold">
                  {/* {submitting ? 'Submitting…' : 'Sign up'} */}Sign up
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
