'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

import { signOut, useSession } from 'next-auth/react';
import { Button } from 'components/ui/button';

import { useSignup } from 'containers/auth/hooks';
import { useRouter } from 'next/router';

const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Please enter your name' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    organization: z.string().min(1, { message: 'Please enter your organization' }),
    password: z.string().nonempty({ message: 'Please enter your password' }).min(6, {
      message: 'Please enter a password with at least 6 characters',
    }),
    'confirm-password': z
      .string()
      .nonempty({ message: 'Please enter your confirmed password' })
      .min(6, { message: 'Please enter a password with at least 6 characters' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data['confirm-password']) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirm-password'],
      });
    }
  });

const AccountContent = () => {
  const signup = useSignup();
  const { push } = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await signOut();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      'confirm-password': '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, username } = values;

    form.clearErrors();

    signup.mutate(
      { user: { email, password, name: username } },
      {
        onSuccess: () => {
          push('/auth/signin?verified=pending');
        },
        onError: (error: any) => {
          const apiErrors = error?.response?.data?.errors;

          if (apiErrors?.email?.[0]) {
            form.setError('email', { type: 'server', message: apiErrors.email[0] });
            return;
          }
          if (apiErrors?.password?.[0]) {
            form.setError('password', { type: 'server', message: apiErrors.password[0] });
            return;
          }

          form.setError('root', {
            type: 'server',
            message: error?.response?.data?.error || 'Signup failed',
          });
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <fieldset className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-brand-800"
                    placeholder="Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-brand-800"
                    placeholder="Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold">Organization</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-brand-800"
                    placeholder="Organization"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="flex w-full items-center gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1.5">
                <FormLabel className="text-xs font-semibold">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-brand-800"
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm-password"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1.5">
                <FormLabel className="text-xs font-semibold">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-brand-800"
                    placeholder="Confirm Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        {form.formState.errors.root?.message && (
          <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={signup.isLoading} className="h-9 font-semibold">
            {signup.isLoading ? 'Saving…' : 'Save changes'}
          </Button>
          <Button type="button" onClick={handleLogout} className="h-9 font-semibold">
            "Log out"
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountContent;
