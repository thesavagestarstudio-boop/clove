import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'clover-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/menu')) {
              const merchantId = env.VITE_CLOVER_MERCHANT_ID || 'QR0WTC2AX35P1';
              const accessToken = env.VITE_CLOVER_ACCESS_TOKEN || '6b4dc5c6-8037-d747-f87c-ef3cd67434c7';
              
              try {
                const [catsRes, itemsRes] = await Promise.all([
                  fetch(`https://api.clover.com/v3/merchants/${merchantId}/categories?limit=100`, {
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
                  }),
                  fetch(`https://api.clover.com/v3/merchants/${merchantId}/items?limit=1000&expand=categories`, {
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
                  })
                ]);
                const categories = await catsRes.json();
                const items = await itemsRes.json();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ categories, items }));
              } catch (err: any) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
              return;
            }
            
            if (req.url?.startsWith('/api/checkout')) {
              if (req.method !== 'POST') {
                res.writeHead(405).end();
                return;
              }
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                const merchantId = env.VITE_CLOVER_MERCHANT_ID || 'QR0WTC2AX35P1';
                const paymentToken = env.VITE_CLOVER_PAYMENT_TOKEN || env.VITE_CLOVER_ACCESS_TOKEN || '6b4dc5c6-8037-d747-f87c-ef3cd67434c7';
                try {
                  const cloverRes = await fetch(`https://api.clover.com/invoicingcheckoutservice/v1/checkouts`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${paymentToken}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body
                  });
                  if (!cloverRes.ok) {
                    const errText = await cloverRes.text();
                    res.writeHead(cloverRes.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: errText || 'Clover pay error' }));
                    return;
                  }
                  const data = await cloverRes.json();
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(data));
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
