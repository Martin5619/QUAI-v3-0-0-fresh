'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'

interface ResultsData {
  name: string
  value: number
}

interface Props {
  questionSetId: string
}

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export function ResultsVisualization({ questionSetId }: Props) {
  const [data, setData] = useState<ResultsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResultsData = async () => {
      try {
        const response = await fetch(`/api/questions/sets/${questionSetId}/results`)
        if (!response.ok) throw new Error('Failed to fetch results data')
        
        const resultsData = await response.json()
        
        // Transform data for visualization
        const transformedData = [
          { name: '90-100%', value: resultsData.excellent || 0 },
          { name: '70-89%', value: resultsData.good || 0 },
          { name: '50-69%', value: resultsData.average || 0 },
          { name: '30-49%', value: resultsData.belowAverage || 0 },
          { name: '0-29%', value: resultsData.poor || 0 }
        ]
        
        setData(transformedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results data')
      } finally {
        setLoading(false)
      }
    }

    if (questionSetId) {
      fetchResultsData()
    }
  }, [questionSetId])

  if (loading) return <div>Loading results data...</div>
  if (error) return <div>Error: {error}</div>
  if (!data.length) return <div>No results data available</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
