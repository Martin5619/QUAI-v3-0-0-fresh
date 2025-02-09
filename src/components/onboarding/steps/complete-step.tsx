"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface CompleteStepProps {
  userId: string
  onNext: () => void
}

export function CompleteStep({ userId, onNext }: CompleteStepProps) {
  const handleNext = async () => {
    try {
      await onNext()
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-6">
          <Icons.check className="h-16 w-16 text-primary animate-in zoom-in-50 duration-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to QUAi!</h1>
        <p className="text-xl text-muted-foreground">
          Your personal learning journey begins here
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icons.book className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Quick Start Guide</h3>
          <p className="mt-2 text-muted-foreground">
            Learn the essentials of QUAi in just a few minutes
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icons.rocket className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Start Learning</h3>
          <p className="mt-2 text-muted-foreground">
            Begin your personalized learning experience
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} size="lg" className="w-full sm:w-auto">
          <Icons.arrowRight className="mr-2 h-4 w-4" />
          Get Started
        </Button>
      </div>
    </div>
  )
}
