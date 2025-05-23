'use client';

import { useCallback, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import cn from 'lib/classnames';

import { zodResolver } from '@hookform/resolvers/zod';
import { HiChevronDown } from 'react-icons/hi';
import { HiCheck } from 'react-icons/hi2';
import { z } from 'zod';

import { TOPICS } from './constants';

// import subscribeNewsletter from '@/containers/newsletter/action';
import { Button } from 'components/ui/button';
import { Checkbox, CheckboxIndicator } from 'components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';

// import { ContactUsEmail } from './email-template';
// import { postContactForm } from 'services/api';

const TOPICS_VALUES = TOPICS.map((topic) => topic.value) as [string, ...string[]];
const isDev = process.env.NODE_ENV === 'development';

export const ContactFormSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(2, 'Name must contain at least 2 characters'),
  organization: z.string(),
  email: z
    .string({ message: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  topic: z.enum(TOPICS_VALUES, { message: 'Please, select a topic' }),
  message: z.string().min(1, 'Message is required'),
  privacyPolicy: isDev
    ? z.boolean().refine((val) => val === true, {
        message: 'You must accept the Privacy Policy',
      })
    : z.boolean().optional(),
});

type FormSchema = z.infer<typeof ContactFormSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      organization: '',
      email: '',
      topic: undefined,
      message: '',
      privacyPolicy: true,
    },
    mode: 'onSubmit',
  });

  const onSubmitData = async (values: FormSchema) => {
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data.error.message);
        throw new Error(data.error || `Failed to send email: ${response.statusText}`);
      }

      setStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  onOpenChange={(open) => setIsOpen(open)}
                  open={isOpen}
                >
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-ring flex h-9 w-full rounded-3xl border border-black/15 py-0 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue placeholder="Select" />
                      <HiChevronDown
                        className={cn({
                          'h-4 w-4': true,
                          'rotate-180': isOpen,
                        })}
                      />
                      <span className="sr-only">Select</span>
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent
                    className="top-2 left-1 z-[90] w-[var(--radix-select-trigger-width)] rounded-3xl border bg-white p-4 text-sm font-light shadow-sm"
                    position="item-aligned"
                  >
                    <div className="space-y-4">
                      {TOPICS.map(({ label, value }) => (
                        <SelectItem key={value} value={value} className="hover:text-brand-800">
                          {label}
                          <span className="sr-only">Select</span>
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
                  <Input placeholder="Enter your message" autoComplete="message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isDev && (
            <FormField
              control={form.control}
              name="privacyPolicy"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormControl>
                    <button type="button" className="flex items-center space-x-2.5 text-black/85">
                      <Checkbox
                        id="privacyPolicy"
                        onCheckedChange={(checked) => field.onChange(checked)}
                        className={cn({
                          '[data=] h-5 w-5 cursor-pointer border border-black/15': true,
                        })}
                        checked={field.value}
                      >
                        <CheckboxIndicator className="bg-brand-800">
                          <HiCheck className="stroke-2 text-white" />
                        </CheckboxIndicator>
                      </Checkbox>
                      <Label htmlFor="privacyPolicy" className="cursor-pointer">
                        I agree with the 
                        <a href="/" className="underline">
                          Privacy Policy.
                        </a>
                      </Label>
                    </button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="space-y-4">
            {status === 'loading' && <p>Sending...</p>}
            {status === 'success' && <p>Email sent successfully!</p>}
            {status === 'error' && <p>Failed to send email. Please try again.</p>}
            <Button type="submit" className="h-9 w-full" disabled={!form.formState.isValid}>
              Send message
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ContactForm;
