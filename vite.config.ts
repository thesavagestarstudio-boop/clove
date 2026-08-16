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
                const paymentToken = env.VITE_CLOVER_PAYMENT_TOKEN || env.VITE_CLOVER_ACCESS_TOKEN || 'bb380920-f0d5-46d7-fefb-4e699b0c4e52';
                try {
                  const cloverRes = await fetch(`https://api.clover.com/invoicingcheckoutservice/v1/checkouts`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${paymentToken}`,
                      'X-Clover-Merchant-Id': merchantId,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'User-Agent': 'CloveKitchenStore/1.0.0'
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

            if (req.url?.startsWith('/api/check-payment')) {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                let checkoutId = '';
                let orderData: any = null;

                if (req.method === 'POST') {
                  try {
                    const parsed = JSON.parse(body);
                    checkoutId = parsed.checkoutId;
                    orderData = parsed.orderData;
                  } catch (e) {}
                } else {
                  const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
                  checkoutId = urlObj.searchParams.get('checkoutId') || '';
                }

                const merchantId = env.VITE_CLOVER_MERCHANT_ID || 'QR0WTC2AX35P1';
                const paymentToken = env.VITE_CLOVER_PAYMENT_TOKEN || env.VITE_CLOVER_ACCESS_TOKEN || 'bb380920-f0d5-46d7-fefb-4e699b0c4e52';
                const accessToken = env.VITE_CLOVER_ACCESS_TOKEN || 'bb380920-f0d5-46d7-fefb-4e699b0c4e52';

                try {
                  const cloverRes = await fetch(`https://api.clover.com/invoicingcheckoutservice/v1/checkouts/${checkoutId}`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${paymentToken}`,
                      'X-Clover-Merchant-Id': merchantId,
                      'Accept': 'application/json',
                      'User-Agent': 'CloveKitchenStore/1.0.0'
                    }
                  });

                  if (!cloverRes.ok) {
                    const errText = await cloverRes.text();
                    res.writeHead(cloverRes.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: errText }));
                    return;
                  }

                  const checkoutData = await cloverRes.json();
                  const isPaid = checkoutData.status === 'PAID' || checkoutData.status === 'SUCCESS' || checkoutData.paymentState === 'PAID';

                  let cloverOrderId = null;
                  if (isPaid && orderData && orderData.items && orderData.items.length > 0) {
                    try {
                      const guestInfo = orderData.guest_info;
                      const customerName = guestInfo ? guestInfo.name : 'Web Customer';
                      const customerPhone = guestInfo ? guestInfo.phone : 'N/A';
                      const orderNote = `Pickup: ${orderData.pickup_time || 'ASAP'} | Cust: ${customerName} | Phone: ${customerPhone}`;

                      const orderCreateRes = await fetch(`https://api.clover.com/v3/merchants/${merchantId}/orders`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${accessToken}`,
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                          'User-Agent': 'CloveKitchenStore/1.0.0'
                        },
                        body: JSON.stringify({
                          state: 'OPEN',
                          title: 'Online Order',
                          note: orderNote,
                          externalReferenceId: checkoutId
                        })
                      });

                      if (orderCreateRes.ok) {
                        const newOrder = await orderCreateRes.json();
                        cloverOrderId = newOrder.id;

                        for (const item of orderData.items) {
                          const priceInCents = Math.round(parseFloat(item.price) * 100);
                          const qty = item.qty || 1;
                          for (let i = 0; i < qty; i++) {
                            await fetch(`https://api.clover.com/v3/merchants/${merchantId}/orders/${cloverOrderId}/line_items`, {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'User-Agent': 'CloveKitchenStore/1.0.0'
                              },
                              body: JSON.stringify({
                                name: item.name,
                                price: priceInCents
                              })
                            });
                          }
                        }

                        let tenderId = null;
                        const tendersRes = await fetch(`https://api.clover.com/v3/merchants/${merchantId}/tenders`, {
                          headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Accept': 'application/json',
                            'User-Agent': 'CloveKitchenStore/1.0.0'
                          }
                        });

                        if (tendersRes.ok) {
                          const tendersData = await tendersRes.json();
                          const tenders = tendersData.elements || [];
                          const targetTender = tenders.find((t: any) => 
                            t.label?.toLowerCase() === 'credit card' || 
                            t.label?.toLowerCase() === 'online order' ||
                            t.id === 'CREDIT_CARD'
                          ) || tenders[0];
                          if (targetTender) {
                            tenderId = targetTender.id;
                          }
                        }

                        const totalInCents = Math.round(parseFloat(orderData.total) * 100);
                        await fetch(`https://api.clover.com/v3/merchants/${merchantId}/orders/${cloverOrderId}/payments`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'User-Agent': 'CloveKitchenStore/1.0.0'
                          },
                          body: JSON.stringify({
                            amount: totalInCents,
                            tender: { id: tenderId }
                          })
                        });
                      }
                    } catch (posErr) {
                      console.error('POS Sync error in local middleware:', posErr);
                    }
                  }

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ ...checkoutData, cloverOrderId }));
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
