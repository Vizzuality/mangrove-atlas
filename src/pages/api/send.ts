import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { renderToStaticMarkup } from 'react-dom/server';
<<<<<<< HEAD
import { ContactUsEmail } from '@/components/contact/email-template';

const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_ADDRESS,
  port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
  secure: Number(process.env.NEXT_PUBLIC_SMTP_PORT) === 465,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER_NAME,
    pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
  },
});

=======
import { ContactUsEmail } from 'components/contact/email-template';

const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_ADDRESS,
  port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
  secure: Number(process.env.NEXT_PUBLIC_SMTP_PORT) === 465,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER_NAME,
    pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
  },
});

>>>>>>> 65b4e479 (contact form update)
export interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
  organization?: string;
  topic?: string;
}

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

const recipients = pickRecipients();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, message, organization, topic } = req.body;

  const html = renderToStaticMarkup(ContactUsEmail({ name, email, message, organization, topic }));

  const text = `Name: ${name}\nEmail: ${email}\nOrganization: ${organization ?? '-'}\nTopic: ${topic ?? '-'}\n\n${message}\n`;

  await transporter.sendMail({
    from: 'GMW <mrtt@globalmangrovewatch.org>',
    to: recipients,
    subject: `New message from ${name}`,
    html,
    text,
    replyTo: email,
  });

  return res.status(200).json({ message: 'Email sent' });
}
