'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Loader2 } from "lucide-react"

interface CompletionStepProps {
  data: any
  onComplete: () => Promise<void>
  isLoading: boolean
}

export function CompletionStep({ data, onComplete, isLoading }: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Icons.check className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">
          You're All Set!
        </h1>
        <p className="text-muted-foreground">
          Your preferences have been saved. Let's start exploring QUAi!
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Selected Plan</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {data.plan} Plan
            </p>
          </div>
          <div>
            <h3 className="font-medium">Role</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {data.role}
            </p>
          </div>
          {data.preferences && (
            <div>
              <h3 className="font-medium">Preferences</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {Object.entries(data.preferences).map(([key, value]) => (
                  <li key={key} className="capitalize">
                    {key.replace(/_/g, ' ')}: {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Go to Dashboard'
          )}
        </Button>
      </div>
    </div>
  )
}
