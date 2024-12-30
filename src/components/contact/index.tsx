'use client';
import { NextApiRequest, NextApiResponse } from 'next';

import { FormEvent, useCallback, useRef, useState } from 'react';
import { Resend } from 'resend';

import { useForm, FormState } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// import subscribeNewsletter from '@/containers/newsletter/action';
import cn from 'lib/classnames';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';

import { HiChevronUpDown } from 'react-icons/hi2';
// import { ContactUsEmail } from './email-template';
// import { postContactForm } from 'services/api';
const TOPICS = [
  { label: 'General', value: 'general' },
  { label: 'Datasets', value: 'datasets' },
  { label: 'GMW Platform', value: 'gmw-platform' },
  { label: 'Mangrove Restoration Tracker Tool', value: 'mrtt' },
  { label: 'Global Mangrove Alliance', value: 'gma' },
] as const;

const TOPICS_VALUES = TOPICS.map((topic) => topic.value) as [string, ...string[]];
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const ContactFormSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(2, 'Name must contain at least 2 characters'),
  organization: z.string(),
  email: z
    .string({ message: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  topic: z.enum(TOPICS_VALUES, { message: 'Please, select a topic' }),
  message: z.string().optional(),
});

type FormSchema = z.infer<typeof ContactFormSchema>;
// const refinedContactFormSchema = ContactFormSchema.superRefine(
//   ({ organizationType, otherOrganization }, ctx) => {
//     if (organizationType === 'other' && otherOrganization === undefined) {
//       return ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Please, provide an answer',
//         path: ['otherOrganization'],
//       });
//     }
//   }
// );

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      organization: '',
      email: '',
      topic: undefined,
      message: '',
    },
    mode: 'onSubmit',
  });

  //   const handleNewsletter = useCallback(
  //     (evt: FormEvent<HTMLFormElement>) => {
  //       evt.preventDefault();

  //       form.handleSubmit(async (formValues) => {
  //         try {
  //           setSubscribedStatus('loading');
  //           const parsed = ContactFormSchema.omit({}).safeParse(formValues);
  //           if (parsed.success) {
  //             const response = await subscribeNewsletter(parsed.data.email, {
  //               FNAME: parsed.data.name.split(' ')[0],
  //               LNAME: parsed.data.name.split(' ')[1],
  //               ...(parsed.data.organizationType !== 'other' && {
  //                 ORG_TYPE: parsed.data.organizationType,
  //               }),
  //               ...(parsed.data.otherOrganization && { ORG_TYPE_O: parsed.data.otherOrganization }),
  //             });
  //             setSubscribedStatus(response.ok ? 'subscribed' : 'error');
  //           }
  //         } catch (err) {
  //           setSubscribedStatus('error');
  //         }
  //       })(evt);
  //     },
  //     [form]
  //   );

  const onSubmitData = async (values: FormSchema) => {
    try {
      console.log('Submitting form data:', values);

      const response = await fetch('api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values), // Send form data to the API
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
      setStatus('success'); // Update form submission status
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error'); // Update status in case of an error
    }
  };
  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)} className="text-black/85">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" type="text" autoComplete="name" {...field} />
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
                <FormLabel className="text-xs">Organization</FormLabel>
                <Input
                  placeholder="Enter your organization"
                  type="text"
                  autoComplete="organization"
                  {...field}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs">Topics</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-ring flex h-9 w-full rounded-3xl border border-black/15 py-0 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent className="top-0 w-full rounded-3xl border bg-white p-4 text-sm font-light shadow-sm">
                    <div className="space-y-4">
                      {TOPICS.map(({ label, value }) => (
                        <SelectItem key={value} value={value} className="hover:text-brand-800">
                          {label}
                          <span className="sr-only">Select</span>
                          <HiChevronUpDown className={cn({ 'h-4 w-4 stroke-[1px]': true })} />
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="text"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs">Your message</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" autoComplete="message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {status === 'loading' && <p>Sending...</p>}
            {status === 'success' && <p>Email sent successfully!</p>}
            {status === 'error' && <p>Failed to send email. Please try again.</p>}
            <Button type="submit" className="h-9 w-full" disabled={false}>
              Send message
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ContactForm;
