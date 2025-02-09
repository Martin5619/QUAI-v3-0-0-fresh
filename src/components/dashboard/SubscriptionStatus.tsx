'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'

interface Usage {
  documentsThisMonth: number
  questionsThisMonth: number
  documentsLimit: number
  questionsLimit: number
}

interface SubscriptionDetails {
  status: string
  currentPeriodEnd?: string
  plan: string
}

export default function SubscriptionStatus() {
  const { data: session } = useSession()
  const router = useRouter()
  const [usage, setUsage] = useState<Usage | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch usage data
        const usageResponse = await fetch('/api/usage')
        const usageData = await usageResponse.json()
        setUsage(usageData)

        // Fetch subscription data
        const subscriptionResponse = await fetch('/api/subscription')
        const subscriptionData = await subscriptionResponse.json()
        setSubscription(subscriptionData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchData()
    }
  }, [session])

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Subscription Status
        </h3>

        {subscription && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                {subscription.plan} Plan
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${
                    subscription.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {subscription.status}
              </span>
            </div>

            {subscription.currentPeriodEnd && (
              <p className="mt-2 text-sm text-gray-500">
                Current period ends on{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {usage && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">Documents</p>
                <p className="text-sm text-gray-500">
                  {usage.documentsThisMonth} / {usage.documentsLimit} this month
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (usage.documentsThisMonth / usage.documentsLimit) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
              <div className="flex-shrink-0">
                <QuestionMarkCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">Questions</p>
                <p className="text-sm text-gray-500">
                  {usage.questionsThisMonth} / {usage.questionsLimit} this month
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (usage.questionsThisMonth / usage.questionsLimit) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {subscription?.status !== 'active' && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleUpgrade}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Upgrade Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
