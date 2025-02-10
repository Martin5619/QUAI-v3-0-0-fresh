'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"

interface UsageOverviewStepProps {
  data: any
  onUpdate: (data: any) => void
  onBack: () => void
}

export function UsageOverviewStep({ data, onUpdate, onBack }: UsageOverviewStepProps) {
  const usageMetrics = {
    documents: {
      used: 0,
      total: data.plan === 'free' ? 3 : 50,
      label: 'Documents'
    },
    questions: {
      used: 0,
      total: data.plan === 'free' ? 50 : 'Unlimited',
      label: 'Questions'
    },
    storage: {
      used: 0,
      total: data.plan === 'free' ? 100 : 1000,
      label: 'Storage (MB)'
    },
    tokens: {
      used: 0,
      total: data.plan === 'free' ? 1000 : 10000,
      label: 'Tokens'
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Your Usage Overview</h1>
        <p className="text-muted-foreground">
          Here's what you get with your {data.plan} plan
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(usageMetrics).map(([key, metric]) => (
          <Card key={key} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{metric.label}</span>
                <span className="font-medium">
                  {metric.used} / {metric.total}
                </span>
              </div>
              <Progress
                value={(metric.used / (typeof metric.total === 'number' ? metric.total : 100)) * 100}
                className="h-2"
              />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-medium mb-2">About Tokens</h3>
        <p className="text-sm text-muted-foreground">
          Tokens are our behind-the-scenes currency that power AI features. They're consumed when:
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
          <li>Processing documents</li>
          <li>Generating AI responses</li>
          <li>Analyzing content</li>
          <li>Storing data</li>
        </ul>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => onUpdate({ usage: usageMetrics })}>
          Continue
        </Button>
      </div>
    </div>
  )
}
