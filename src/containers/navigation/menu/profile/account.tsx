'use client';

import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { signOut, useSession } from 'next-auth/react';
import { z } from 'zod';

import { OTHER_ROLE_VALUE, ROLE_OPTIONS } from '@/containers/auth/constants';
import { usePutUpdateUser } from '@/containers/auth/hooks';

import RolesSelect from '@/components/auth/roles-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from 'components/ui/button';
import { Checkbox, CheckboxIndicator } from 'components/ui/checkbox';

import CHECK_SVG from '@/svgs/ui/check';

const ROLE_VALUES = ROLE_OPTIONS.map((o) => o.value);

const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Please enter your name' }).optional(),
    email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
    organization: z.string().optional(),
    user_roles: z
      .array(z.string().refine((v) => ROLE_VALUES.includes(v)))
      .optional()
      .default([]),
    user_role_other: z.string().optional(),
    // Empty string means "not changing the password".
    password: z
      .string()
      .min(6, {
        message: 'Please enter a password with at least 6 characters',
      })
      .optional()
      .or(z.literal('')),
    current_password: z.string().optional(),
    delete_account: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.user_roles?.includes(OTHER_ROLE_VALUE) && !data.user_role_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe your role',
        path: ['user_role_other'],
      });
    }
    // Current password is only needed to change the password.
    if (data.password && !data.current_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter your current password',
        path: ['current_password'],
      });
    }
  });

const AccountContent = () => {
  const { data: session, update: updateSession } = useSession();
  const [rolesOpen, setRolesOpen] = useState(false);

  const user = session?.user;
  const updateUser = usePutUpdateUser();

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
      user_roles: user?.roles ?? [],
      user_role_other: user?.other_role || '',
      password: '',
      current_password: '',
    },
  });

  const showOtherRole = form.watch('user_roles')?.includes(OTHER_ROLE_VALUE);
  const changingPassword = !!form.watch('password');

  // current_password is a confirmation, not a profile change — typing it alone
  // shouldn't enable saving.
  const hasChanges = Object.keys(form.formState.dirtyFields).some(
    (field) => field !== 'current_password'
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, username, organization, user_roles, current_password } = values;
    const otherRole = values['user_role_other']?.trim();

    form.clearErrors();

    updateUser.mutate(
      {
        user: {
          email,
          name: username,
          organization,
          user_roles: user_roles ?? [],
          // Only send password fields when the user is actually changing it.
          ...(password ? { password, current_password } : {}),
          ...(user_roles?.includes(OTHER_ROLE_VALUE) && otherRole
            ? { user_role_other: otherRole }
            : {}),
        },
      },
      {
        onSuccess: () => {
          // NextAuth local-session contract uses `roles`/`other_role` (read by the
          // jwt callback in auth.ts) — not the API's `user_roles`/`user_role_other`.
          void updateSession({
            name: username,
            organization,
            roles: user_roles ?? [],
            other_role: user_roles?.includes(OTHER_ROLE_VALUE) && otherRole ? otherRole : null,
          });
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

          <FormField
            control={form.control}
            name="user_roles"
            render={({ field }) => (
              <FormItem className="gap-0">
                <FormLabel className="text-xs font-semibold">What is your role?</FormLabel>
                {/* No FormControl: RolesSelect does not forward refs, and Slot
                    would warn. FormMessage still picks up the field error. */}
                <RolesSelect
                  id="account-roles"
                  placeholder="Select the roles that describe you"
                  options={ROLE_OPTIONS}
                  values={field.value ?? []}
                  onOpenChange={setRolesOpen}
                  onChange={(selection) => {
                    field.onChange(selection);
                    if (!selection.includes(OTHER_ROLE_VALUE)) {
                      form.setValue('user_role_other', '');
                      form.clearErrors('user_role_other');
                    }
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {showOtherRole && (
            <FormField
              control={form.control}
              name="user_role_other"
              render={({ field }) => (
                <FormItem className="gap-0">
                  <FormLabel className="text-xs font-semibold" required>
                    Other role
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                      placeholder="Tell us your role"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                      onChange={(e) => {
                        field.onChange(e);
                        // Back to "not changing the password": drop the
                        // confirmation field state along with the input.
                        if (!e.target.value) {
                          form.setValue('current_password', '');
                          form.clearErrors('current_password');
                        }
                      }}
                      className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-zinc-400"
                      // Masked dots so the (unknown) stored password reads as set.
                      placeholder="••••••••"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {changingPassword && (
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem className="flex-1 gap-0">
                    <FormLabel className="text-xs font-semibold" required>
                      Current Password
                    </FormLabel>
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
            )}
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
                      <CHECK_SVG
                        className="h-full w-full fill-current"
                        role="img"
                        title="Checkmark"
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
          <Button
            type="submit"
            disabled={updateUser.isPending || !hasChanges || rolesOpen}
            className="h-9 font-semibold"
          >
            {updateUser.isPending ? 'Saving…' : 'Save changes'}
          </Button>
          <Button
            type="button"
            onClick={handleLogout}
            className="h-9 font-semibold"
            variant="outline"
          >
            Log out
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountContent;
