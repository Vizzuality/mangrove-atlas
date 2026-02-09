import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { user } = req.body ?? {};

  const { email, current_password, ...rest } = user ?? {};

  if (!email || !current_password) return res.status(400).json({ error: 'Missing email/password' });

  const upstream = await fetch(`${process.env.AUTH_API_URL}/users`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      user: { email, current_password, ...rest },
    }),
  });

  const text = await upstream.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {}

  if (!upstream.ok) {
    return res.status(upstream.status).json({
      error: data?.error || data?.message || 'Update failed',
      details: data ?? text,
    });
  }

  return res.status(200).json({ ok: true, data });
}
