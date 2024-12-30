import { Resend } from 'resend';

// Simple email template function
const ContactUsEmail = ({ name, email, message }) => (
  <div>
    <p>
      <strong>Name:</strong> ${name}
    </p>
    <p>
      <strong>Email:</strong> ${email}
    </p>
    <p>
      <strong>Message:</strong> ${message}
    </p>
  </div>
);
// Initialize Resend instance
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Parse request body
      const { name, email, message } = req.body;

      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: 'GMW <onboarding@resend.dev>',
        to: ['maluenarod@gmail.com'], // Replace with your recipient's email
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
