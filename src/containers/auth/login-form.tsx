'use client';

import { z } from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const { query } = router;

  const { status } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    form.clearErrors();

    const callbackUrl = typeof query?.callbackUrl === 'string' ? query.callbackUrl : '/';

    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    });

    if (!result?.ok) {
      form.setError('root', {
        type: 'server',
        message:
          result?.error && result.error !== 'CredentialsSignin'
            ? result.error
            : 'Invalid credentials',
      });
      return;
    }

    router.replace(result.url ?? callbackUrl);
  }

  if (status === 'loading' || status === 'authenticated') return null;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root?.message && (
            <p className="text-right text-sm text-red-400">{form.formState.errors.root.message}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="h-9 w-full font-semibold">
            {isSubmitting ? 'Submitting…' : 'Log in'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginForm;
