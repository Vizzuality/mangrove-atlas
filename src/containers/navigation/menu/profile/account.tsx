'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

import { signOut, useSession } from 'next-auth/react';
import { Button } from 'components/ui/button';

import { usePutUpdateUser } from '@/containers/auth/hooks';
import { useRouter } from 'next/router';
import { Checkbox, CheckboxIndicator } from 'components/ui/checkbox';
import { Icon } from 'components/ui/icon';

import CHECK_SVG from '@/svgs/ui/check.svg?sprite';
import { Label } from 'recharts';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Please enter your name' }).optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  organization: z.string().optional(),
  password: z
    .string()
    .nonempty({ message: 'Please enter your password' })
    .min(6, {
      message: 'Please enter a password with at least 6 characters',
    })
    .optional(),
  current_password: z
    .string()
    .nonempty({ message: 'Please enter your password' })
    .min(6, { message: 'Please enter your password' }),
  delete_account: z.boolean().optional(),
});

const AccountContent = () => {
  const { push } = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const updateUser = usePutUpdateUser(user?.accessToken || '');

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await signOut();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.name || '',
      organization: user?.organization || '',
      email: user?.email || '',
      password: undefined,
      current_password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, username, organization, current_password } = values;

    form.clearErrors();

    updateUser.mutate(
      {
        user: {
          email,
          password,
          name: username,
          current_password: values['current-password'],
          organization,
        },
      },
      {
        onSuccess: () => {
          push('/auth/users?verified=pending');
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
            message:
              error?.response?.data?.error ||
              'An error occurred while updating your details. Please try again.',
          });
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <fieldset className="space-y-6 p-1">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="gap-0">
                <FormLabel className="text-xs font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
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
              <FormItem className="gap-0">
                <FormLabel className="text-xs font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
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
              <FormItem className="gap-0">
                <FormLabel className="text-xs font-semibold">Organization</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                    placeholder="Organization"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full items-center gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1 gap-0">
                  <FormLabel className="text-xs font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                      placeholder="Enter your new password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem className="flex-1 gap-0">
                  <FormLabel className="text-xs font-semibold">Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                      placeholder="Enter your current password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <div className="flex w-full items-center gap-6 pb-9">
          <p className="flex-1 text-sm text-red-500">{form.formState.errors.password?.message}</p>
          {form.formState.errors.current_password?.message && (
            <p className="flex-1 text-sm text-red-500">
              {form.formState.errors.current_password.message}
            </p>
          )}
        </div>
        {form.formState.errors.root?.message && (
          <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}
        <FormField
          control={form.control}
          name="delete_account"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormControl>
                <button
                  type="button"
                  className="flex h-full items-center space-x-2.5 text-black/85"
                >
                  <Checkbox
                    className="{cn({ 'absolute border-none': true, })} right-2 bottom-2 h-5 w-5 items-center rounded-full"
                    disabled={true}
                  >
                    <CheckboxIndicator className="text-black/85">
                      <Icon
                        icon={CHECK_SVG}
                        className="h-full w-full fill-current"
                        description="Checkmark"
                      />
                    </CheckboxIndicator>
                  </Checkbox>
                  <FormLabel className="m-0 text-xs font-semibold">Delete account</FormLabel>
                </button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Button type="submit" disabled={updateUser.isLoading} className="h-9 font-semibold">
            {updateUser.isLoading ? 'Saving…' : 'Save changes'}
          </Button>
          <Button type="button" onClick={handleLogout} className="h-9 font-semibold">
            Log out
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountContent;
