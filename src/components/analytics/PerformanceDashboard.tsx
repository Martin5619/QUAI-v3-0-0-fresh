'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { format } from 'date-fns'
import { LoadingState } from '@/components/ui/loading'
import { 
  Trophy,
  Target,
  Clock,
  BookOpen
} from 'lucide-react'

interface PerformanceData {
  overview: {
    totalAttempts: number
    averageScore: number
    totalQuestions: number
    bestScore: number
    totalTime: number
  }
  recentScores: Array<{
    date: string
    score: number
    totalQuestions: number
  }>
  topicPerformance: Array<{
    topic: string
    correct: number
    total: number
    percentage: number
  }>
  timeDistribution: Array<{
    range: string
    count: number
  }>
}

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c']

export function PerformanceDashboard() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await fetch('/api/analytics/performance')
        if (!response.ok) {
          throw new Error('Failed to fetch performance data')
        }
        const performanceData = await response.json()
        setData(performanceData)
      } catch (err) {
        setError('Failed to load performance metrics')
        console.error('Error fetching performance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  if (loading) {
    return <LoadingState />
  }

  if (error || !data) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          {error || 'Failed to load performance metrics'}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Best Score</p>
              <h3 className="text-2xl font-bold">{data.overview.bestScore}%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <h3 className="text-2xl font-bold">{data.overview.averageScore}%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Questions Answered</p>
              <h3 className="text-2xl font-bold">{data.overview.totalQuestions}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Time</p>
              <h3 className="text-2xl font-bold">{Math.round(data.overview.totalTime / 60)}m</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Score History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Score History</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.recentScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                formatter={(value: number) => [`${value}%`, 'Score']}
              />
              <Bar 
                dataKey="score" 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Topic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Topic Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.topicPerformance}
                  dataKey="percentage"
                  nameKey="topic"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.topicPerformance.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Time Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.timeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#9333ea"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
