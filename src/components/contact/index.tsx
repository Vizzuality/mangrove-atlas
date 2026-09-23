'use client';

import { useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';
import { PRIVACY_NOTICE_URL } from '@/lib/legal';

import { zodResolver } from '@hookform/resolvers/zod';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import CHECK_SVG from '@/svgs/ui/check';

import { TOPICS } from './constants';

const TOPICS_VALUES = TOPICS.map((topic) => topic.value) as [string, ...string[]];

const ContactFormSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(2, 'Name must contain at least 2 characters'),
  organization: z.string(),
  email: z
    .string({ message: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  topic: z.enum(TOPICS_VALUES, { message: 'Please, select a topic' }),
  message: z.string().min(1, 'Message is required'),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Privacy Notice',
  }),
});

type FormSchema = z.infer<typeof ContactFormSchema>;

const LABEL_CLASS = 'text-xs font-semibold leading-[18px]';

function ContactForm() {
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
      privacyPolicy: false,
    },
    mode: 'onSubmit',
  });

  const onSubmitData = async (values: FormSchema) => {
    setStatus('loading');
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      // Google Analytics tracking
      trackEvent('Contact form - submit', {
        category: 'Menu - contact form - help',
        action: 'Submit',
        label: 'Contact form',
      });

      const data = await response.json();

      if (!response.ok) {
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
                <FormLabel className={LABEL_CLASS}>Name</FormLabel>
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
                <FormLabel className={LABEL_CLASS}>Organization</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your organization name"
                    type="text"
                    autoComplete="organization"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={LABEL_CLASS}>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
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
            name="topic"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={LABEL_CLASS}>Topic</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  onOpenChange={(open) => setIsOpen(open)}
                  open={isOpen}
                >
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-brand-800 focus:ring-brand-800 flex h-9 w-full rounded-3xl border border-black/15 px-3 py-0 text-sm font-light focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-black/60">
                      <SelectValue placeholder="Select one" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={cn({
                          'h-4 w-4 shrink-0 text-black/85': true,
                          'rotate-180': isOpen,
                        })}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent
                    className="top-2 left-1 z-90 w-(--radix-select-trigger-width) rounded-3xl border bg-white p-4 text-sm font-light shadow-sm"
                    position="item-aligned"
                  >
                    <div className="space-y-4">
                      {TOPICS.map(({ label, value }) => (
                        <SelectItem key={value} value={value} className="hover:text-brand-800">
                          {label}
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
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={LABEL_CLASS}>Your message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center gap-2.5 text-sm text-black/85">
                  <FormControl>
                    <CheckboxPrimitive.Root
                      aria-labelledby="privacyPolicy-label"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      className="focus-visible:ring-brand-800 data-[state=checked]:border-brand-800 data-[state=checked]:bg-brand-800 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border border-black/15 bg-white text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      <CheckboxPrimitive.Indicator>
                        <CHECK_SVG className="h-3 w-3 fill-current" aria-hidden="true" />
                      </CheckboxPrimitive.Indicator>
                    </CheckboxPrimitive.Root>
                  </FormControl>
                  <span id="privacyPolicy-label">
                    I agree with the{' '}
                    <Link
                      href={PRIVACY_NOTICE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Privacy Notice
                    </Link>
                    .
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {status === 'loading' && <p className="text-sm">Sending...</p>}
            {status === 'success' && <p className="text-sm">Email sent successfully!</p>}
            {status === 'error' && (
              <p className="text-sm text-red-700">Failed to send email. Please try again.</p>
            )}
            <Button
              type="submit"
              className="h-9 w-full font-bold"
              disabled={status === 'loading' || status === 'success'}
            >
              Send message
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ContactForm;
