'use client'

import { useSession } from 'next-auth/react'

interface PlanDetails {
  name: string;
  features: {
    documentsPerMonth: number;
    questionsPerMonth: number;
    additionalFeatures: string[];
  };
}

interface PlanStatusProps {
  plan: string
}

const PLAN_DETAILS: Record<string, PlanDetails> = {
  free: {
    name: 'Free Plan',
    features: {
      documentsPerMonth: 5,
      questionsPerMonth: 20,
      additionalFeatures: ['Basic document analysis', 'Standard question generation']
    }
  },
  pro: {
    name: 'Pro Plan',
    features: {
      documentsPerMonth: 50,
      questionsPerMonth: 200,
      additionalFeatures: ['Advanced document analysis', 'Custom question types', 'Priority support']
    }
  },
  enterprise: {
    name: 'Enterprise Plan',
    features: {
      documentsPerMonth: 500,
      questionsPerMonth: 2000,
      additionalFeatures: ['Unlimited document analysis', 'Custom integrations', '24/7 support', 'API access']
    }
  }
}

const planInfo = {
  free: {
    name: 'Free Plan',
    description: 'Basic features for personal use',
    color: 'bg-gray-100 text-gray-800'
  },
  basic: {
    name: 'Basic Plan',
    description: 'Essential features for small teams',
    color: 'bg-blue-100 text-blue-800'
  },
  pro: {
    name: 'Pro Plan',
    description: 'Advanced features for growing teams',
    color: 'bg-purple-100 text-purple-800'
  },
  ultimate: {
    name: 'Ultimate Plan',
    description: 'All features for large organizations',
    color: 'bg-indigo-100 text-indigo-800'
  }
}

export default function PlanStatus({ plan }: PlanStatusProps) {
  const { data: session } = useSession()
  const userPlan = (session?.user as any)?.stripeSubscriptionPlan || 'free'
  const planDetails = PLAN_DETAILS[userPlan]
  const currentPlan = planInfo[plan] || planInfo.free

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Current Plan: {planDetails.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your subscription plan and features
            </p>
          </div>
          {userPlan === 'free' && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.location.href = '/pricing'}
            >
              Upgrade Plan
            </button>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Plan Features:</h4>
          <ul className="mt-2 divide-y divide-gray-200">
            <li className="py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Monthly Document Limit</span>
                <span className="text-sm font-medium text-gray-900">{planDetails.features.documentsPerMonth}</span>
              </div>
            </li>
            <li className="py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Monthly Question Limit</span>
                <span className="text-sm font-medium text-gray-900">{planDetails.features.questionsPerMonth}</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Additional Features:</h4>
          <ul className="mt-2 space-y-1">
            {planDetails.features.additionalFeatures.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${currentPlan.color}`}>
            {currentPlan.name}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {currentPlan.description}
          </p>
        </div>
      </div>
    </div>
  )
}
