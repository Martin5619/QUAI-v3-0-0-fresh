"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UsageMetrics {
  documentsUsed: number
  questionsGenerated: number
  storageUsed: number
  tokensUsed: number
}

interface UsageCirclesProps {
  metrics?: UsageMetrics
  className?: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function UsageCircle({ 
  used = 0, 
  total, 
  label, 
  formatter = (n: number) => n.toString() 
}: { 
  used?: number
  total: number
  label: string
  formatter?: (n: number) => string
}) {
  const percentage = Math.min(100, ((used || 0) / total) * 100)
  const isWarning = percentage >= 80
  const isDanger = percentage >= 90

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <Progress
          value={percentage}
          className={cn(
            "h-24 w-24 rotate-[-90deg]",
            isWarning && "text-yellow-500",
            isDanger && "text-red-500"
          )}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold">
            {formatter(used || 0)}
          </span>
          <span className="text-xs text-muted-foreground">
            / {total === Infinity ? "∞" : formatter(total)}
          </span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  )
}

export function UsageCircles({ metrics, className }: UsageCirclesProps) {
  const planLimits = {
    documents: 50,
    questions: 100,
    storage: 1024 * 1024 * 1024, // 1GB
    tokens: 100000
  }

  // If metrics are undefined, show empty circles
  const safeMetrics = metrics || {
    documentsUsed: 0,
    questionsGenerated: 0,
    storageUsed: 0,
    tokensUsed: 0
  }

  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold mb-6">Resource Usage</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <UsageCircle
          used={safeMetrics.documentsUsed}
          total={planLimits.documents}
          label="Documents"
        />
        <UsageCircle
          used={safeMetrics.questionsGenerated}
          total={planLimits.questions}
          label="Questions"
        />
        <UsageCircle
          used={safeMetrics.storageUsed}
          total={planLimits.storage}
          label="Storage"
          formatter={formatBytes}
        />
        <UsageCircle
          used={safeMetrics.tokensUsed}
          total={planLimits.tokens}
          label="Tokens"
          formatter={(n) => `${(n / 1000).toFixed(1)}k`}
        />
      </div>
    </Card>
  )
}
