import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ message: 'Missing email/password' });

    const upstreamRes = await fetch(`${process.env.AUTH_API_URL}/users/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ user: { email, password } }),
      redirect: 'manual',
    });

    const text = await upstreamRes.text();
  } catch (err: any) {
    console.error('[/api/auth/login] crashed:', err);
    return res.status(500).json({ message: err?.message || 'Internal server error' });
  }
}
