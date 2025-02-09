"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsData {
  date: string
  questionsGenerated: number
  questionsAnswered: number
  accuracy: number
  timeSpent: number
}

interface LearningAnalyticsProps {
  className?: string
  userId: string
}

export function LearningAnalytics({ className, userId }: LearningAnalyticsProps) {
  // This would typically be fetched from an API
  const analyticsData: AnalyticsData[] = [
    {
      date: "Mon",
      questionsGenerated: 20,
      questionsAnswered: 18,
      accuracy: 85,
      timeSpent: 45,
    },
    {
      date: "Tue",
      questionsGenerated: 25,
      questionsAnswered: 22,
      accuracy: 88,
      timeSpent: 50,
    },
    {
      date: "Wed",
      questionsGenerated: 30,
      questionsAnswered: 28,
      accuracy: 92,
      timeSpent: 60,
    },
    {
      date: "Thu",
      questionsGenerated: 22,
      questionsAnswered: 20,
      accuracy: 90,
      timeSpent: 40,
    },
    {
      date: "Fri",
      questionsGenerated: 28,
      questionsAnswered: 25,
      accuracy: 89,
      timeSpent: 55,
    },
  ]

  const stats = [
    {
      title: "Questions Generated",
      value: "125",
      change: "+12%",
      icon: Icons.brain,
    },
    {
      title: "Average Accuracy",
      value: "89%",
      change: "+5%",
      icon: Icons.target,
    },
    {
      title: "Study Time",
      value: "4.2h",
      change: "+2h",
      icon: Icons.clock,
    },
    {
      title: "Documents Used",
      value: "8",
      change: "+3",
      icon: Icons.file,
    },
  ]

  return (
    <Card className={cn("col-span-full", className)}>
      <CardHeader>
        <CardTitle>Learning Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">{stat.title}</h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <span className="text-sm text-green-500">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border">
            <div className="p-4">
              <h4 className="text-sm font-medium">Weekly Activity</h4>
            </div>
            <div className="h-[300px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="questionsGenerated"
                    stroke="#8884d8"
                    name="Questions Generated"
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#82ca9d"
                    name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Question Generation</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document Analysis</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Practice Sessions</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Questions Remaining</span>
                    <span className="text-sm font-medium">75/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document Storage</span>
                    <span className="text-sm font-medium">2.1/5 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Credits</span>
                    <span className="text-sm font-medium">45/50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
