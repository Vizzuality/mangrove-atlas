import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const tokenAuth = (token as any)?.tokenAuth ?? null;

  if (!tokenAuth) return res.status(404).json({ tokenAuth: null });
  return res.status(200).json({ tokenAuth });
}
