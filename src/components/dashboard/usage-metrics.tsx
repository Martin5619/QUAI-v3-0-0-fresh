"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Database, Zap, AlertCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UsageMetricsProps {
  className?: string
  userId: string
}

interface MetricData {
  used: number
  total: number
  label: string
  warning?: boolean
}

interface Metrics {
  [key: string]: MetricData
}

export function UsageMetrics({ className, userId }: UsageMetricsProps) {
  // This will be replaced with real data from the API
  const metrics: Metrics = {
    documents: { used: 2, total: 3, label: "Documents", warning: true },
    questions: { used: 35, total: 50, label: "Questions" },
    storage: { used: 75, total: 100, label: "Storage (MB)" },
    tokens: { used: 800, total: 1000, label: "Tokens", warning: true }
  }

  const getIcon = (metric: string) => {
    switch (metric) {
      case "documents":
        return <FileText className="h-4 w-4" />
      case "questions":
        return <MessageSquare className="h-4 w-4" />
      case "storage":
        return <Database className="h-4 w-4" />
      case "tokens":
        return <Zap className="h-4 w-4" />
      default:
        return null
    }
  }

  const calculatePercentage = (used: number, total: number) => {
    return (used / total) * 100
  }

  const getCircleColor = (percentage: number, warning: boolean | undefined) => {
    if (warning) return "text-yellow-500 dark:text-yellow-400"
    if (percentage > 90) return "text-destructive dark:text-destructive"
    if (percentage > 75) return "text-yellow-500 dark:text-yellow-400"
    return "text-primary dark:text-primary"
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Usage Overview</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Upgrade Plan
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upgrade to increase your limits</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, metric]) => {
          const percentage = calculatePercentage(metric.used, metric.total)
          const circleColor = getCircleColor(percentage, metric.warning)
          
          return (
            <div key={key} className="relative">
              <div className="flex flex-col items-center">
                <div className={`relative w-20 h-20 ${circleColor}`}>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${percentage}, 100`}
                      className="stroke-current transition-all duration-300 ease-in-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getIcon(key)}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">{metric.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {metric.used}/{metric.total}
                  </div>
                </div>
                {metric.warning && (
                  <div className="absolute -top-1 -right-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 text-warning" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Approaching limit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
