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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Make VITE_DEEPL_API_KEY available in process.env for the plugin
  process.env.VITE_DEEPL_API_KEY = env.VITE_DEEPL_API_KEY;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/n8n-chat': {
          target: 'https://gwu0a4k-n8n.bocindonesia.com/webhook/983f0dda-9bfe-4d09-99b1-e2e55f1f83f4/chat',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/n8n-chat/, ''),
          secure: false,
        },
      },
    },
    plugins: [react(), translateApiPlugin()],
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
