import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to handle /api/translate in development
function translateApiPlugin(): Plugin {
  return {
    name: 'translate-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/translate' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const { text, target_lang } = JSON.parse(body);
              const DEEPL_API_KEY = process.env.VITE_DEEPL_API_KEY;

              if (!DEEPL_API_KEY) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'DeepL API key not configured' }));
                return;
              }

              const response = await fetch('https://api-free.deepl.com/v2/translate', {
                method: 'POST',
                headers: {
                  'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  text: Array.isArray(text) ? text.join('\n') : text,
                  target_lang: target_lang,
                }),
              });

              const data = await response.json();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            } catch (error) {
              console.error('Translation error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Translation failed' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// Groq AI Chat plugin for development
function groqAiPlugin(): Plugin {
  return {
    name: 'groq-ai-chat',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/ai-chat' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { message, history = [] } = JSON.parse(body);
              const GROQ_API_KEY = process.env.GROQ_API_KEY;

              if (!GROQ_API_KEY) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Groq API key not configured' }));
                return;
              }

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

              const messages = [
                { role: 'system', content: systemPrompt },
                ...history.slice(-6),
                { role: 'user', content: message }
              ];

              const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${GROQ_API_KEY}`,
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
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: data.error.message || 'Groq API error' }));
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                reply: data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.',
                model: data.model,
                usage: data.usage,
              }));
            } catch (error) {
              console.error('AI Chat error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'AI chat failed' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// Map Vercel serverless routes to local dev server
function vercelApiPlugin(): Plugin {
  return {
    name: 'vercel-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        
        req.on('end', async () => {
             try {
                // Mock request object format needed by our handlers
                const mockReq = {
                    method: req.method,
                    headers: req.headers,
                    body: body ? JSON.parse(body) : {}
                };
                
                // Mock response object
                const mockRes = {
                    statusCode: 200,
                    headers: {} as any,
                    setHeader(key: string, val: string) { this.headers[key.toLowerCase()] = val; return this; },
                    status(code: number) { this.statusCode = code; return this; },
                    json(data: any) { this.end(JSON.stringify(data)); },
                    end(data?: string) {
                        res.statusCode = this.statusCode;
                        Object.keys(this.headers).forEach(k => res.setHeader(k, this.headers[k]));
                        if (data) {
                           res.setHeader('Content-Type', 'application/json');
                           res.end(data);
                        } else {
                           res.end();
                        }
                    }
                };

                const url = req.url?.split('?')[0];

                if (url === '/api/login') {
                    const handler = await import('./api/login.js');
                    return handler.default(mockReq, mockRes);
                } 
                else if (url === '/api/db') {
                    const handler = await import('./api/db.js');
                    return handler.default(mockReq, mockRes);
                }
                else if (url === '/api/upload') {
                    const handler = await import('./api/upload.js');
                    return handler.default(mockReq, mockRes);
                }
                next();
             } catch (e) {
                 console.error('Vite API Middleware Error:', e);
                 res.statusCode = 500;
                 res.setHeader('Content-Type', 'application/json');
                 res.end(JSON.stringify({error: 'Dev Server Error'}));
             }
        });
      });
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Make API keys available in process.env for plugins
  process.env.VITE_DEEPL_API_KEY = env.VITE_DEEPL_API_KEY;
  process.env.GROQ_API_KEY = env.GROQ_API_KEY;
  process.env.ADMIN_PASSWORD = env.ADMIN_PASSWORD;
  process.env.TURSO_DATABASE_URL = env.TURSO_DATABASE_URL;
  process.env.TURSO_AUTH_TOKEN = env.TURSO_AUTH_TOKEN;
  process.env.CLOUDINARY_CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME;
  process.env.CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY;
  process.env.CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), translateApiPlugin(), groqAiPlugin(), vercelApiPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
