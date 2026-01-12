'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

import Logo from 'components/logo';
import { Button } from 'components/ui/button';

import { useSignup } from 'containers/auth/hooks';
import { useRouter } from 'next/router';

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import AccountContent from './account';
import SubscriptionsContent from './subscriptions';
import SavedAreasContent from './saved-areas';

const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Please enter your name' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
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

const Profile = () => {
  const signup = useSignup();
  const { push, query } = useRouter();

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
    <div className="space-y-6">
      <h2 className="text-3xl font-light leading-[32px] text-black/85">My profile</h2>

      <Tabs defaultValue="account" className="min-w-[476px] space-y-6">
        <TabsList className="w-full gap-2">
          <TabsTrigger value="account" className="flex-1">
            Account
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex-1">
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="saved-areas" className="flex-1">
            Saved areas
          </TabsTrigger>
          <TabsTrigger value="mrtt" className="flex-1">
            MRTT
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountContent />
        </TabsContent>
        <TabsContent value="subscriptions">
          <SubscriptionsContent />
        </TabsContent>
        <TabsContent value="saved-areas">
          <SavedAreasContent />
        </TabsContent>
        <TabsContent value="mrtt">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
