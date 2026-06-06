import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const MERCHANT_ID = process.env.VITE_CLOVER_MERCHANT_ID || 'QR0WTC2AX35P1'
const ACCESS_TOKEN = process.env.VITE_CLOVER_ACCESS_TOKEN || '6b4dc5c6-8037-d747-f87c-ef3cd67434c7'

async function run() {
  const payload = {
    customer: {
      email: "customer@clovekitchen.com"
    },
    shoppingCart: {
      lineItems: [
        {
          name: "Test Item",
          unitQty: 1,
          price: 1000
        }
      ]
    },
    redirectUrl: "http://localhost:3000/"
  }

  console.log('Testing checkout with token:', ACCESS_TOKEN)
  const cloverRes = await fetch(`https://api.clover.com/v1/checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  console.log('Status:', cloverRes.status)
  const text = await cloverRes.text()
  console.log('Response:', text)
}

run().catch(console.error)
