'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useUserContext } from '@/contexts/user-context'

interface UsageData {
  date: string
  documents: number
  questions: number
}

export function UsageChart() {
  const { id } = useUserContext()
  const [data, setData] = useState<UsageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await fetch('/api/analytics/usage')
        if (!response.ok) throw new Error('Failed to fetch usage data')
        
        const usageData = await response.json()
        setData(usageData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load usage data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUsageData()
    }
  }, [id])

  if (loading) return <div>Loading usage data...</div>
  if (error) return <div>Error: {error}</div>
  if (!data.length) return <div>No usage data available</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="documents" fill="#4f46e5" name="Documents" />
              <Bar dataKey="questions" fill="#06b6d4" name="Questions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
