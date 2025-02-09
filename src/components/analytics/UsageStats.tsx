'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { format } from 'date-fns'
import { LoadingState } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { Usage_v2414 } from '@prisma/client'

interface UsageData {
  currentPlan: string
  limits: {
    documentsPerMonth: number
    questionsPerMonth: number
  }
  usage: {
    documents: number
    questions: number
    documentsUsagePercent: number
    questionsUsagePercent: number
  }
  history: Array<{
    date: string
    documents: number
    questions: number
  }>
}

export function UsageStats() {
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/analytics/usage_v2414')
        if (!response.ok) {
          throw new Error('Failed to fetch usage data')
        }
        const data = await response.json()
        setUsageData(data)
      } catch (err) {
        setError('Failed to load usage statistics')
        console.error('Error fetching usage:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  if (loading) {
    return <LoadingState />
  }

  if (error || !usageData) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          {error || 'Failed to load usage statistics'}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Current Plan</h3>
          <Badge variant="secondary" className="capitalize">
            {usageData.currentPlan}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Document Usage */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Documents Used</span>
              <span>{usageData.usage.documents} / {usageData.limits.documentsPerMonth}</span>
            </div>
            <Progress 
              value={usageData.usage.documentsUsagePercent} 
              className="h-2"
            />
          </div>

          {/* Question Usage */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Questions Generated</span>
              <span>{usageData.usage.questions} / {usageData.limits.questionsPerMonth}</span>
            </div>
            <Progress 
              value={usageData.usage.questionsUsagePercent}
              className="h-2"
            />
          </div>
        </div>
      </Card>

      {/* Usage Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Usage Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="documents" 
                stroke="#2563eb" 
                name="Documents"
              />
              <Line 
                type="monotone" 
                dataKey="questions" 
                stroke="#16a34a" 
                name="Questions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
