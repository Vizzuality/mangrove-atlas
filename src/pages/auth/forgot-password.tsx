'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useResetPassword } from '@/containers/auth/hooks';
import LandingNavigation from '@/containers/navigation/landing';

import SuccessAlert from 'components/auth/email-alert';
import Logo from 'components/logo';
import { Button } from 'components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export default function ForgotPasswordPage() {
  const resetPassword = useResetPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  function onSubmit(values: { email: string }) {
    form.clearErrors('email');
    resetPassword.mutate(
      { user: { email: values.email, source: 'gmw' } },
      {
        onError: (e) => {
          form.setError('email', {
            type: 'manual',
            message: 'Could not request password reset. Please try again.',
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
        style={{ backgroundImage: 'url(/images/login/image.webp)' }}
      />

      <section className="mx-auto w-full max-w-md px-4 pb-20">
        <LandingNavigation />
        <div className="flex h-full w-full flex-col justify-center space-y-10">
          <h1 className="text-brand-800 font-sans text-[40px] font-light">Forgot Password</h1>
          {resetPassword.isSuccess && (
            <SuccessAlert message="Please check your inbox for instructions to reset your password" />
          )}

          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <fieldset className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold" required>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                            placeholder="Email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
                <Button
                  type="submit"
                  disabled={resetPassword.isLoading || resetPassword.isSuccess}
                  className="h-9 w-full font-semibold"
                >
                  {resetPassword.isLoading ? 'Submitting…' : 'Submit'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
