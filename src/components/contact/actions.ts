'use server';

import { z } from 'zod';

import mailchimp from '@/lib/mailchimp';

import { NewsletterSchema } from '@/containers/newsletter/index';

export const contactFormActions = async (
  email: z.infer<typeof NewsletterSchema>['email'],
  mergeFields: {
    FNAME: string;
    LNAME: string;
    ORG_TYPE?: string | undefined;
    ORG_TYPE_O?: string | undefined;
  }
) => {
  try {
    await mailchimp.lists.addListMember('77ab6984cf', {
      status: 'subscribed',
      email_address: email,
      merge_fields: {
        ...mergeFields,
      },
    });

    return {
      ok: true,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        ok: false,
        message: err.message,
      };
    }

    return {
      ok: false,
      message: 'Error sending contact form',
    };
  }
};

export default contactFormActions;

import { Resend } from 'resend';
import * as React from 'react';
import { ContactUsEmail } from 'components/contact/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const payload = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'your-email@domain.com',
      to: payload.email,
      subject: `Thank you for contacting us, ${payload.name}`,
      react: ContactUsEmail(payload),
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}
