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

  // Support both POST (new flow with cart details) and GET (legacy flow fallback)
  let checkoutId;
  let orderData = null;

  if (req.method === 'POST') {
    checkoutId = req.body.checkoutId;
    orderData = req.body.orderData;
  } else if (req.method === 'GET') {
    checkoutId = req.query.checkoutId;
  } else {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!checkoutId) {
    res.status(400).json({ error: 'checkoutId is required' })
    return
  }

  const merchantId = process.env.CLOVER_MERCHANT_ID || 'QR0WTC2AX35P1'
  const paymentToken = process.env.CLOVER_PAYMENT_TOKEN || process.env.CLOVER_ACCESS_TOKEN || 'bb380920-f0d5-46d7-fefb-4e699b0c4e52'
  const accessToken = process.env.CLOVER_ACCESS_TOKEN || 'bb380920-f0d5-46d7-fefb-4e699b0c4e52'

  console.log(`[Clover check-payment] Verifying checkoutId: ${checkoutId} for Merchant: ${merchantId}`)

  try {
    // 1. Verify checkout session payment status with Clover
    const cloverRes = await fetch(`https://api.clover.com/invoicingcheckoutservice/v1/checkouts/${checkoutId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paymentToken}`,
        'X-Clover-Merchant-Id': merchantId,
        'Accept': 'application/json',
        'User-Agent': 'CloveKitchenStore/1.0.0'
      }
    })

    if (!cloverRes.ok) {
      const errText = await cloverRes.text()
      throw new Error(errText || `Clover API responded with ${cloverRes.status}`)
    }

    const checkoutData = await cloverRes.json()
    const isPaid = checkoutData.status === 'PAID' || checkoutData.status === 'SUCCESS' || checkoutData.paymentState === 'PAID'

    // 2. If paid and we have order details, sync to Clover POS
    let cloverOrderId = null
    if (isPaid && orderData && orderData.items && orderData.items.length > 0) {
      try {
        console.log('[Clover check-payment] Payment verified. Creating order in Clover POS...')

        // Format customer note for ticket printing
        const guestInfo = orderData.guest_info
        const customerName = guestInfo ? guestInfo.name : 'Web Customer'
        const customerPhone = guestInfo ? guestInfo.phone : 'N/A'
        const orderNote = `Pickup: ${orderData.pickup_time || 'ASAP'} | Cust: ${customerName} | Phone: ${customerPhone}`

        // Create base POS Order
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
        })

        if (!orderCreateRes.ok) {
          const createErr = await orderCreateRes.text()
          console.error('[Clover check-payment] Failed to create POS order:', createErr)
        } else {
          const newOrder = await orderCreateRes.json()
          cloverOrderId = newOrder.id
          console.log(`[Clover check-payment] Created POS Order ID: ${cloverOrderId}`)

          // Add line items (with looping for quantities)
          for (const item of orderData.items) {
            const priceInCents = Math.round(parseFloat(item.price) * 100)
            const lineItemBody = {
              name: item.name,
              price: priceInCents
            }

            // Loop and add item multiple times according to quantity
            const qty = item.qty || 1
            for (let i = 0; i < qty; i++) {
              await fetch(`https://api.clover.com/v3/merchants/${merchantId}/orders/${cloverOrderId}/line_items`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'User-Agent': 'CloveKitchenStore/1.0.0'
                },
                body: JSON.stringify(lineItemBody)
              })
            }
          }
          console.log('[Clover check-payment] Added all line items to POS order')

          // Lookup merchant payment tenders
          let tenderId = null
          const tendersRes = await fetch(`https://api.clover.com/v3/merchants/${merchantId}/tenders`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
              'User-Agent': 'CloveKitchenStore/1.0.0'
            }
          })

          if (tendersRes.ok) {
            const tendersData = await tendersRes.json()
            const tenders = tendersData.elements || []
            const targetTender = tenders.find(t => 
              t.label?.toLowerCase() === 'credit card' || 
              t.label?.toLowerCase() === 'online order' ||
              t.id === 'CREDIT_CARD'
            ) || tenders[0]
            if (targetTender) {
              tenderId = targetTender.id
            }
          }

          // Record bookkeeping payment to mark the order as paid in the POS screen
          const totalInCents = Math.round(parseFloat(orderData.total) * 100)
          const paymentRes = await fetch(`https://api.clover.com/v3/merchants/${merchantId}/orders/${cloverOrderId}/payments`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'CloveKitchenStore/1.0.0'
            },
            body: JSON.stringify({
              amount: totalInCents,
              tender: {
                id: tenderId
              }
            })
          })

          if (paymentRes.ok) {
            console.log('[Clover check-payment] Recorded POS bookkeeping payment successfully')
          } else {
            const payErr = await paymentRes.text()
            console.error('[Clover check-payment] Failed to record POS bookkeeping payment:', payErr)
          }
        }
      } catch (posErr) {
        console.error('[Clover check-payment] Error syncing order details to Clover POS:', posErr)
      }
    }

    // Return the checkout status and the created Clover Order ID back to client
    res.status(200).json({
      ...checkoutData,
      cloverOrderId: cloverOrderId
    })
  } catch (err) {
    console.error('API Check Payment error:', err)
    res.status(500).json({ error: err.message || 'Failed to check payment status' })
  }
}
