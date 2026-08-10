'use client';

import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { OTHER_ROLE_VALUE, ROLE_OPTIONS } from '@/containers/auth/constants';
import { useSignup } from '@/containers/auth/hooks';
import LandingNavigation from '@/containers/navigation/landing';

import FooterSignin from '@/components/auth/footer-signin';
import RolesSelect from '@/components/auth/roles-select';
import Logo from 'components/logo';
import { Button } from 'components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

const ROLE_VALUES = ROLE_OPTIONS.map((o) => o.value);

const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Please enter your name' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    organization: z.string().optional(),
    user_roles: z
      .array(z.string().refine((v) => ROLE_VALUES.includes(v)))
      .optional()
      .default([]),
    user_role_other: z.string().optional(),
    password: z.string().nonempty({ message: 'Please enter your password' }).min(6, {
      message: 'Please enter a password with at least 6 characters',
    }),
    'confirm-password': z
      .string()
      .nonempty({ message: 'Confirm password' })
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
    if (data.user_roles?.includes(OTHER_ROLE_VALUE) && !data.user_role_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe your role',
        path: ['user_role_other'],
      });
    }
  });

export default function SignupPage() {
  const signup = useSignup();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      'confirm-password': '',
      organization: '',
      user_roles: [],
      user_role_other: '',
    },
  });

  const showOtherRole = form.watch('user_roles')?.includes(OTHER_ROLE_VALUE);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, username, organization, user_roles } = values;
    const otherRole = values.user_role_other?.trim();

    form.clearErrors();

    signup.mutate(
      {
        user: {
          email,
          password,
          name: username,
          ...(organization?.trim() ? { organization: organization.trim() } : {}),
          ...(user_roles?.length ? { user_roles } : {}),
          ...(user_roles?.includes(OTHER_ROLE_VALUE) && otherRole
            ? { user_role_other: otherRole }
            : {}),
        },
      },
      {
        onSuccess: () => {
          router.push('/auth/signin?verified=pending');
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
          <h1 className="text-brand-800 font-sans text-[40px] font-light">Sign up</h1>
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <fieldset className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold" required>
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-black/60"
                            placeholder="Name"
                            autoComplete="name"
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
                        <FormLabel className="text-xs font-semibold" required>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-black/60"
                            placeholder="Email"
                            autoComplete="email"
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
                            className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-black/60"
                            placeholder="Organization"
                            autoComplete="organization"
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
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">What is your role?</FormLabel>
                        {/* No FormControl: RolesSelect does not forward refs, and Slot
                            would warn. FormMessage still picks up the field error. */}
                        <RolesSelect
                          id="signup-roles"
                          placeholder="Select the roles that describe you"
                          options={ROLE_OPTIONS}
                          values={field.value ?? []}
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
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold" required>
                            Other role
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus:border-brand-800 block w-full rounded-[100px] border border-black/10 px-3 py-2 text-sm placeholder:text-black/60"
                              placeholder="Tell us your role"
                              autoComplete="organization-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                    name="confirm-password"
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
                            className="focus:border-brand-800 block w-full rounded-[100px] px-3 py-2 text-sm placeholder:text-black/60"
                            placeholder="Password"
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
                <Button
                  type="submit"
                  disabled={signup.isPending}
                  className="h-9 w-full font-semibold"
                >
                  {signup.isPending ? 'Submitting…' : 'Register'}
                </Button>
              </form>
            </Form>

            <hr className="border-black/10" />

            <FooterSignin />
          </div>
        </div>
      </section>
    </div>
  );
}
