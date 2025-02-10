"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, MessageSquare, Database, Zap } from "lucide-react"

interface UsageMetricsProps {
  className?: string
  userId: string
}

export function UsageMetrics({ className, userId }: UsageMetricsProps) {
  // This will be replaced with real data from the API
  const metrics = {
    documents: { used: 0, total: 3, label: "Documents" },
    questions: { used: 0, total: 50, label: "Questions" },
    storage: { used: 0, total: 100, label: "Storage (MB)" },
    tokens: { used: 0, total: 1000, label: "Tokens" }
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

  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Usage Overview</h2>
      <div className="space-y-4">
        {Object.entries(metrics).map(([key, metric]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                {getIcon(key)}
                <span>{metric.label}</span>
              </div>
              <span className="text-muted-foreground">
                {metric.used} / {metric.total}
              </span>
            </div>
            <Progress
              value={(metric.used / metric.total) * 100}
              className="h-2"
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
