'use client';

import { useCallback, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import cn from '@/lib/classnames';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import { TOPICS } from './constants';

<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
=======
import { Button } from 'components/ui/button';
import { Checkbox, CheckboxIndicator } from 'components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
>>>>>>> 65b4e479 (contact form update)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
<<<<<<< HEAD
} from '@/components/ui/select';
import { trackEvent } from '@/lib/analytics/ga';
=======
} from 'components/ui/select';
import { trackEvent } from 'lib/analytics/ga';
>>>>>>> 65b4e479 (contact form update)

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
                    <SelectTrigger className="focus-visible:ring-ring focus:ring-brand-800 flex h-9 w-full rounded-3xl border border-black/15 px-3 py-0 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue placeholder="Select" />
                      {/* <LuChevronDown
                        className={cn({
                          'h-4 w-4': true,
                          'rotate-180': isOpen,
                        })}
                    
                      /> */}
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
                        className={cn({
                          'lucide lucide-chevron-down-icon lucide-chevron-down h-4 w-4': true,
                          'rotate-180': isOpen,
                        })}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                      <span className="sr-only">Select</span>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="lucide lucide-circle-check-icon lucide-circle-check stroke-2 text-white"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
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
