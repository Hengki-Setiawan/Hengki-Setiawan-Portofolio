// Vercel Serverless Function: AI Chat with Groq
// This file is auto-detected by Vercel when deployed

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Basic in-memory rate limiting (Note: in Vercel serverless, this only works per region/instance)
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!global.rateLimitMap) {
    global.rateLimitMap = new Map();
  }
  
  const hits = global.rateLimitMap.get(ip) || [];
  // Filter hits within the last 60 seconds
  const recentHits = hits.filter(timestamp => now - timestamp < 60000);
  
  if (recentHits.length >= 7) {
    return res.status(429).json({ error: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat lagi.' });
  }
  
  recentHits.push(now);
  global.rateLimitMap.set(ip, recentHits);

  const systemPrompt = `You are Hengki's AI Portfolio Assistant. You help visitors learn about Hengki Setiawan — a Digital Entrepreneur, Community Builder, and Web Developer & Vibe Coder from Makassar, Indonesia.

PROFIL LENGKAP:
- Mahasiswa S1 Bisnis Digital di Universitas Negeri Makassar (UNM), 2023–sekarang
- Lulusan SMK N 4 Makassar jurusan Pemasaran Digital (2018–2021)
- Juara 1 Kompetisi E-Commerce antar mahasiswa S1 Bisnis Digital UNM
- Email: hengkisetiawan461@gmail.com | Telepon: +62 895-8034-63032 | Website: hengkisetiawan.my.id

PENGALAMAN KERJA:
- Lead Admin & Manajer Komunitas (Nov 2021–sekarang): Membangun komunitas Facebook hingga 500.000+ anggota aktif (Kami Depresi, dll.) serta akun Facebook personal 12K+ Pengikut.
- Owner Kaos Kami (Jun 2022–sekarang): Brand pakaian e-commerce dengan 600+ produk terjual, rating 4.9/5.0 Shopee
- Staf Toko Alfamidi / PT Midi Utama Indonesia Tbk (Sep 2021–Agu 2022)

PROYEK UTAMA:
- MoodLab (moodlab.web.id) — Platform e-commerce bisnis pemenang Juara 1 lomba. TypeScript, fullstack.
- Kaos Kami (kaoskami.biz.id) — Toko online brand sendiri
- Kaos Kami SCM — Sistem manajemen rantai pasok internal
- Dashboard Kaos Kami — Dashboard operasional bisnis
- SimbisData — Dashboard business intelligence
- Prediksi MCGG — Tools prediksi & analitik
- Portfolio Web Interaktif (hengki-setiawan-portofolio.vercel.app) — Dibangun dengan React, Supabase, AI tools

SKILLS TEKNIS: TypeScript, JavaScript, HTML/CSS, React, Supabase, TailwindCSS, Vite, Vercel, GitHub, Prompt Engineering, Vibe Coding, Telegram Bot API, Shopee/Tokopedia Seller

BAHASA: Bahasa Indonesia (native), English (working knowledge)

Guidelines:
- Be friendly, professional, and concise
- Answer in the same language the visitor uses (Indonesian or English)
- If asked about hiring/projects, encourage them to visit /contact
- If asked about CV, point them to /cv
- If you don't know something specific, say so honestly
- Keep responses under 150 words unless more detail is needed`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Groq API error' });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.',
      model: data.model,
      usage: data.usage,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return res.status(500).json({ error: 'AI chat failed' });
  }
}
