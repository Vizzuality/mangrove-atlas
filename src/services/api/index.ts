import axios from 'axios';
import { Resend } from 'resend';

import { ContactUsEmail } from 'components/contact/email-template';

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v2`,
  headers: { 'Content-Type': 'application/json' },
});

export const AnalysisAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ANALYSIS_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const BlogAPI = axios.create({
  baseURL: '/blog',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'max-age=3600',
  },
});

export const PlanetAPI = axios.create({
  baseURL: '/planet-api',
  headers: { 'Content-Type': 'application/json' },
});

export const ClimateWatchAPI = axios.create({
  baseURL: 'https://www.climatewatchdata.org/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function postContactForm(req: Request) {
  const payload = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'your-email@domain.com',
      to: 'maluenarod@gmail.com',
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

export default API;
