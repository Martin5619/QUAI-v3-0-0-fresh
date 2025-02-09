'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { STRIPE_PRICE_IDS, createCheckoutSession, createOneTimeCheckoutSession } from '@/lib/stripe-client'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  priceId: string
  isSubscription?: boolean
  featured?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out QUAi',
    features: [
      '5 documents per month',
      '50 questions per month',
      'Basic question types',
      'Email support',
    ],
    priceId: '',  // No price ID for free tier
  },
  {
    name: 'Basic',
    price: '$5',
    description: 'Great for individual educators',
    features: [
      '10 documents per month',
      '100 questions per month',
      'Advanced question types',
      'Priority email support',
      'Export options',
    ],
    priceId: STRIPE_PRICE_IDS.basic,
    featured: false,
  },
  {
    name: 'Pro',
    price: '$15',
    description: 'For power users who need more',
    features: [
      '50 documents per month',
      '500 questions per month',
      'Advanced features',
      'Priority support',
      'API access',
    ],
    priceId: STRIPE_PRICE_IDS.pro,
    featured: true,
  },
  {
    name: 'Ultimate',
    price: '$20',
    description: '30 days of unlimited access',
    features: [
      'Unlimited documents',
      'Unlimited questions',
      'All features included',
      '30 days access',
      'Priority support',
      'API access',
    ],
    priceId: STRIPE_PRICE_IDS.ultimate,
  },
  {
    name: 'Monthly Unlimited',
    price: '$20/month',
    description: 'Best value for regular users',
    features: [
      'Unlimited documents',
      'Unlimited questions',
      'All features included',
      'Monthly subscription',
      'Priority support',
      'API access',
      'Early access to new features',
    ],
    priceId: STRIPE_PRICE_IDS.monthly,
    isSubscription: true,
  },
  {
    name: 'Team',
    price: 'Custom',
    description: 'Custom solutions for teams',
    features: [
      'Custom document limits',
      'Custom user limits',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support',
      'Training sessions',
    ],
    priceId: '',  // No price ID for team tier
  },
]

export function PricingSection() {
  const { data: session } = useSession()
  const router = useRouter()

  const handlePurchase = async (tier: PricingTier) => {
    // Handle free tier
    if (tier.name === 'Free') {
      router.push('/auth/signup?plan=free')
      return
    }

    // Handle team tier
    if (tier.name === 'Team') {
      router.push('/contact')
      return
    }

    // Handle paid tiers
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const sessionId = tier.isSubscription
        ? await createCheckoutSession(tier.priceId)
        : await createOneTimeCheckoutSession(tier.priceId)

      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to create checkout session. Please try again.')
    }
  }

  return (
    <section id="pricing" className="bg-gray-50 dark:bg-gray-900/50 py-24 sm:py-32 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Choose the perfect plan for your needs
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Start with our free tier and upgrade as you grow. All plans except Monthly Unlimited are one-time payments.
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-3">
          {pricingTiers.slice(0, 3).map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800/90 p-8 ring-1 ring-gray-200 dark:ring-gray-700 xl:p-10 backdrop-blur-sm transition-all duration-200 hover:scale-105 ${
                tier.featured ? 'lg:z-10 relative ring-2 ring-primary shadow-xl' : ''
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-1 text-center text-sm font-medium text-white shadow-lg">
                  Most popular
                </div>
              )}
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={`text-lg font-semibold leading-8 ${
                    tier.featured ? 'text-primary' : 'text-gray-900 dark:text-white'
                  }`}>
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  {tier.isSubscription && (
                    <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">/month</span>
                  )}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => handlePurchase(tier)}
                className={`mt-8 ${
                  tier.featured
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-primary/10 hover:bg-primary/20 text-primary'
                }`}
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
