"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface UsageStepProps {
  data: {
    plan: string
    usage: {
      documents: number
      questions: number
      storage: number
      tokens: number
    }
  }
  onUpdate: (data: any) => void
  onNext: () => void
  isLoading: boolean
}

export function UsageStep({ data, onNext, isLoading }: UsageStepProps) {
  console.log("[USAGE_STEP] Rendering with data:", data)

  const limits = data.plan === "free" 
    ? {
        documents: 3,
        questions: 50,
        storage: 100,
        tokens: 1000
      }
    : data.plan === "pro"
    ? {
        documents: 50,
        questions: 1000,
        storage: 1024,
        tokens: 10000
      }
    : {
        documents: 1000,
        questions: 10000,
        storage: 10240,
        tokens: 100000
      }

  const handleFinish = () => {
    console.log("[USAGE_STEP] Finish clicked")
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Plan Usage</CardTitle>
        <CardDescription>
          Here's an overview of your plan limits and current usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Documents</span>
              <span>{data.usage.documents} / {limits.documents}</span>
            </div>
            <Progress value={(data.usage.documents / limits.documents) * 100} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Questions</span>
              <span>{data.usage.questions} / {limits.questions}</span>
            </div>
            <Progress value={(data.usage.questions / limits.questions) * 100} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage (MB)</span>
              <span>{data.usage.storage} / {limits.storage}</span>
            </div>
            <Progress value={(data.usage.storage / limits.storage) * 100} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tokens</span>
              <span>{data.usage.tokens} / {limits.tokens}</span>
            </div>
            <Progress value={(data.usage.tokens / limits.tokens) * 100} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleFinish}
          disabled={isLoading}
        >
          {isLoading ? "Setting up..." : "Go to Dashboard"}
        </Button>
      </CardFooter>
    </Card>
  )
}
