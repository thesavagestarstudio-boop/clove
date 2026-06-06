export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const paymentToken = process.env.CLOVER_PAYMENT_TOKEN || process.env.CLOVER_ACCESS_TOKEN || '6b4dc5c6-8037-d747-f87c-ef3cd67434c7'

  try {
    const cloverRes = await fetch(`https://api.clover.com/v1/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paymentToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    })

    if (!cloverRes.ok) {
      const errText = await cloverRes.text()
      throw new Error(errText || 'Clover pay API error')
    }

    const data = await cloverRes.json()
    res.status(200).json(data)
  } catch (err) {
    console.error('API Checkout error:', err)
    res.status(500).json({ error: err.message || 'Failed to create checkout session' })
  }
}
