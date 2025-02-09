'use client'

export const STRIPE_PRICE_IDS = {
  basic: 'price_1QjIAeKxkmcjGYc9FubBC3ZY',    // $5 one-time payment
  pro: 'price_1QjIBCKxkmcjGYc9VeGcFq6C',      // $15 one-time payment
  ultimate: 'price_1QjIBoKxkmcjGYc9Q8pKjJK0',  // $20 one-time payment
  monthly: 'price_1QjIDjKxkmcjGYc95lYvPpax',   // $20/month subscription
} as const

export async function createCheckoutSession(priceId: string) {
  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const data = await response.json()
    return data.sessionId
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createOneTimeCheckoutSession(priceId: string) {
  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, mode: 'payment' }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const data = await response.json()
    return data.sessionId
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
