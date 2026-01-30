import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.authToken;

  if (!token) return res.status(401).json({ ok: false });

  // TODO: valida token
  return res.status(200).json({ ok: true });
}
