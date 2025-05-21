import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

import { ContactUsEmail } from 'components/contact/email-template';

// Define types for the email template props
interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

// Initialize Resend instance
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

// Define response types
type ContactResponse = {
  message?: string;
  data?: any;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ContactResponse>) {
  if (req.method === 'POST') {
    try {
      // Parse request body
      const { name, email, message } = req.body as ContactEmailProps;
      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: 'GMW <onboarding@resend.dev>',
        to: ['maria.luena@vizzuality.com'], // Replace with your recipient's email
        subject: `New message from ${name}`,
        react: ContactUsEmail({ name, email, message }), // Pass dynamic content
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Fallback text content
      });

      // Handle errors
      if (error) {
        console.error('Resend error:', error);
        return res.status(400).json({ error: 'Failed to send email' });
      }

      // Return success response
      res.status(200).json({ message: 'Email sent successfully', data });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
