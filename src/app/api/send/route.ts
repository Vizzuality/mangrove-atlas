import { NextResponse } from 'next/server';

import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { z } from 'zod';

import { ContactUsEmail } from '@/components/contact/email-template';
import { env } from 'env.mjs';

export const dynamic = 'force-dynamic';

export interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
  organization?: string;
  topic?: string;
}

const ContactBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  message: z.string().trim().min(1).max(5000),
  organization: z.string().trim().max(200).optional(),
  topic: z.string().max(50).optional(),
});

function pickRecipients(topic?: string): string[] {
  switch (topic) {
    case 'gmw-platform':
      return ['kate.longley-wood@tnc.org', 'lammert.hilarides@wetlands.org'];
    case 'general':
      return ['marice.leal@tnc.org', 'kate.longley-wood@tnc.org'];
    case 'datasets':
      return ['pfb@aber.ac.uk', 'lammert.hilarides@wetlands.org'];
    case 'mrtt':
      return ['taw52@cam.ac.uk', 'lanie.esch@wwfus.org'];
    case 'gma':
      return ['contact@globalmangrovealliance.org'];
    default:
      return ['kate.longley-wood@tnc.org', 'lammert.hilarides@wetlands.org'];
  }
}

function getTransporter() {
  const { SMTP_ADDRESS, SMTP_PORT, SMTP_USER_NAME, SMTP_PASSWORD } = env;
  if (!SMTP_ADDRESS || !SMTP_PORT || !SMTP_USER_NAME || !SMTP_PASSWORD) return null;

  return nodemailer.createTransport({
    host: SMTP_ADDRESS,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER_NAME, pass: SMTP_PASSWORD },
  });
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = ContactBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid contact form data' }, { status: 400 });
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.error('Contact form: SMTP_* env vars are not configured');
    return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 });
  }

  const { name, email, message, organization, topic } = parsed.data;

  try {
    const html = await render(ContactUsEmail({ name, email, message, organization, topic }));
    const text = `Name: ${name}\nEmail: ${email}\nOrganization: ${organization ?? '-'}\nTopic: ${topic ?? '-'}\n\n${message}\n`;

    await transporter.sendMail({
      from: 'GMW <mrtt@globalmangrovewatch.org>',
      to: pickRecipients(topic),
      subject: `New message from ${name}`,
      html,
      text,
      replyTo: email,
    });
  } catch (error) {
    console.error('Contact form: failed to send email', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
  }

  return NextResponse.json({ message: 'Email sent' });
}
