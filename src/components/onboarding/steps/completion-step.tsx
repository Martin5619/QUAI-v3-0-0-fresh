'use client'

import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"

interface CompletionStepProps {
  data: any
  onComplete: () => void
}

export function CompletionStep({ data, onComplete }: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-green-100 p-2 dark:bg-green-900">
          <CheckIcon className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">All Set!</h1>
        <p className="text-muted-foreground">
          Your QUAi account is ready to go
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Account Summary</h3>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name:</dt>
              <dd className="font-medium">{data.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Theme:</dt>
              <dd className="font-medium">{data.preferences.theme}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Notifications:</dt>
              <dd className="font-medium">{data.preferences.notifications}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
          <p className="text-sm text-green-800 dark:text-green-200">
            Your profile has been created successfully. Click below to start using QUAi!
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={onComplete} className="w-full">
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
