'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useUserContext } from '@/contexts/user-context'

interface PerformanceData {
  date: string
  averageScore: number
  questionsAnswered: number
}

export function PerformanceMetrics() {
  const { id } = useUserContext()
  const [data, setData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch('/api/analytics/performance')
        if (!response.ok) throw new Error('Failed to fetch performance data')
        
        const performanceData = await response.json()
        setData(performanceData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load performance data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPerformanceData()
    }
  }, [id])

  if (loading) return <div>Loading performance data...</div>
  if (error) return <div>Error: {error}</div>
  if (!data.length) return <div>No performance data available</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone"
                dataKey="averageScore"
                stroke="#4f46e5"
                name="Average Score"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="questionsAnswered"
                stroke="#06b6d4"
                name="Questions Answered"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
