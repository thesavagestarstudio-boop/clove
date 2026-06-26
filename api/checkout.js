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

  const merchantId = process.env.CLOVER_MERCHANT_ID || 'QR0WTC2AX35P1'
  const paymentToken = process.env.CLOVER_PAYMENT_TOKEN || process.env.CLOVER_ACCESS_TOKEN || 'bb380920-f0d5-46d7-fefb-4e699b0c4e52'

  console.log(`[Clover Checkout API] Merchant ID: ${merchantId}, Token start: ${paymentToken.substring(0, 4)}...`)

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
