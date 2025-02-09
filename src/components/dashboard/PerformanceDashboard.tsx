'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Text
} from 'recharts'

interface PerformanceMetrics {
  overview: {
    totalAttempts: number
    averageScore: number
    totalQuestions: number
    bestScore: number
    totalTime: number
  }
  recentScores: {
    date: string
    score: number
    totalQuestions: number
  }[]
  topicPerformance: {
    topic: string
    correct: number
    total: number
    percentage: number
  }[]
  timeDistribution: {
    range: string
    count: number
  }[]
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    overview: {
      totalAttempts: 0,
      averageScore: 0,
      totalQuestions: 0,
      bestScore: 0,
      totalTime: 0
    },
    recentScores: [],
    topicPerformance: [],
    timeDistribution: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/performance_v2414')
        if (!response.ok) {
          throw new Error('Failed to fetch performance metrics')
        }
        const data = await response.json()
        console.log('[Dashboard_v2414] Fetched metrics:', data)
        setMetrics(data)
      } catch (err) {
        setError('Failed to load performance metrics')
        console.error('[Dashboard_v2414] Error fetching metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center text-gray-500 p-4">
        No performance data available
      </div>
    )
  }

  // Format the chart data
  const chartData = (metrics.recentScores || []).map(score => ({
    date: new Date(score.date).toLocaleDateString(),
    score: Math.round(score.score)
  })).reverse()

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Attempts</h3>
          <p className="text-2xl font-bold">{metrics.overview.totalAttempts}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
          <p className="text-2xl font-bold">{Math.round(metrics.overview.averageScore)}%</p>
          <Progress value={metrics.overview.averageScore} className="mt-2" />
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Questions Answered</h3>
          <p className="text-2xl font-bold">{metrics.overview.totalQuestions}</p>
        </Card>
      </div>

      {/* Performance Chart */}
      {chartData.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 70 ? '#22c55e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Topic Performance */}
      {metrics.topicPerformance?.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Topic Performance</h3>
          <div className="space-y-4">
            {metrics.topicPerformance.map((topic, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{topic.topic}</span>
                  <span>{Math.round(topic.percentage)}%</span>
                </div>
                <Progress value={topic.percentage} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
