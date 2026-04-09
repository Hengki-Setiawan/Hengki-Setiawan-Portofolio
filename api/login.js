import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const inputEmail = req.body.email?.trim() || '';
  const inputPassword = req.body.password?.trim() || '';

  const validEmail = 'hengkishadow@gmail.com';
  const validPassword = (process.env.ADMIN_PASSWORD || 'admin12345').trim();

  if ((inputEmail === validEmail || inputEmail === 'hengkis123@gmail.com') && inputPassword === validPassword) {
    const token = jwt.sign({ role: 'admin', email: inputEmail }, validPassword, { expiresIn: '1w' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: 'Email atau Password salah!' });
}
