import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const accessToken = (token as any)?.accessToken;

    if (accessToken) {
      await fetch(`${process.env.AUTH_API_URL}/users/sign_out`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(200).json({ ok: true });
  }
}
