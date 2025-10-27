// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const upstream = await fetch('https://mrtt.globalmangrovewatch.org/users/sign_in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // opcional: forward headers relevantes
      Cookie: req.headers.cookie || '',
    },
    body: JSON.stringify(req.body),
    redirect: 'manual',
  });

  const data = await upstream.text(); // puede ser json o texto
  // Copiar y ajustar cookies
  const setCookie = upstream.headers.raw()['set-cookie'] || [];
  // Reescribe las cookies para tu dominio actual: elimina Domain y SameSite si rompe
  const rewritten = setCookie.map(
    (c) =>
      c
        .replace(/;\s*Domain=[^;]*/i, '') // elimina Domain
        .replace(/;\s*SameSite=None/i, '; SameSite=Lax') // ajusta si hace falta
    // .replace(/;\s*Secure/i, '') // quitar Secure sólo si estás en http (no recomendado)
  );

  if (rewritten.length) {
    res.setHeader('Set-Cookie', rewritten);
  }

  // Copia código de estado
  res.status(upstream.status);

  // Detecta JSON
  try {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.parse(data));
  } catch {
    return res.send(data);
  }
}
