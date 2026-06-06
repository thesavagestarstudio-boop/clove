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

  const merchantId = process.env.CLOVER_MERCHANT_ID || 'QR0WTC2AX35P1'
  const accessToken = process.env.CLOVER_ACCESS_TOKEN || '6b4dc5c6-8037-d747-f87c-ef3cd67434c7'

  try {
    const [catsRes, itemsRes] = await Promise.all([
      fetch(`https://api.clover.com/v3/merchants/${merchantId}/categories?limit=100`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }),
      fetch(`https://api.clover.com/v3/merchants/${merchantId}/items?limit=1000&expand=categories`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })
    ])

    if (!catsRes.ok || !itemsRes.ok) {
      throw new Error(`Clover API responded with error. Categories: ${catsRes.status}, Items: ${itemsRes.status}`)
    }

    const categories = await catsRes.json()
    const items = await itemsRes.json()

    res.status(200).json({ categories, items })
  } catch (err) {
    console.error('API Menu error:', err)
    res.status(500).json({ error: err.message || 'Failed to fetch menu' })
  }
}
