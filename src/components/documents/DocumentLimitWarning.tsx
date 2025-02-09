'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'

interface DocumentLimitWarningProps {
  currentCount: number
  limit: number
  isUnlimited: boolean
}

export function DocumentLimitWarning({ currentCount, limit, isUnlimited }: DocumentLimitWarningProps) {
  if (isUnlimited || currentCount < limit) {
    return null
  }

  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200 mb-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Document Limit Reached
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You have reached your document limit ({limit} documents).
              To add more documents, you can either:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Upgrade your plan to increase your limit</li>
              <li>Delete existing documents to free up space</li>
            </ul>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
