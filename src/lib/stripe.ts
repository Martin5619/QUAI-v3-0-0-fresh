import Stripe from 'stripe'

// Only initialize Stripe on the server side
let stripe: Stripe | null = null

if (typeof window === 'undefined' && process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  })
}

export const STRIPE_PRICE_IDS = {
  basic: 'price_1QjIAeKxkmcjGYc9FubBC3ZY',    // $5 one-time payment
  pro: 'price_1QjIBCKxkmcjGYc9VeGcFq6C',      // $15 one-time payment
  ultimate: 'price_1QjIBoKxkmcjGYc9Q8pKjJK0',  // $20 one-time payment
  monthly: 'price_1QjIDjKxkmcjGYc95lYvPpax',   // $20/month subscription
} as const

export interface StripeSubscription {
  id: string
  status: string
  currentPeriodEnd: number
  plan: {
    id: string
    name: string
  }
}

export async function createCheckoutSession(priceId: string, userId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/api/stripe/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    client_reference_id: userId,
  })

  return session
}

export async function createOneTimeCheckoutSession(priceId: string, userId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/api/stripe/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    client_reference_id: userId,
  })

  return session
}

export async function getSubscription(subscriptionId: string): Promise<StripeSubscription | null> {
  if (!stripe) {
    throw new Error('Stripe is not initialized')
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      plan: {
        id: subscription.items.data[0].price.id,
        name: subscription.items.data[0].price.nickname || 'Unknown Plan',
      },
    }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized')
  }

  try {
    await stripe.subscriptions.cancel(subscriptionId)
    return true
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return false
  }
}

export default stripe
