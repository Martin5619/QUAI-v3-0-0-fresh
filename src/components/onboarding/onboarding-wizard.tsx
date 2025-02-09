"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { WelcomeStep } from "./steps/welcome-step"
import { ProfileStep } from "./steps/profile-step"
import { PlanStep } from "./steps/plan-step"
import { TeamStep } from "./steps/team-step"
import { LanguagesStep } from "./steps/languages-step"
import { CompleteStep } from "./steps/complete-step"

const STEPS = [
  "welcome",
  "profile",
  "plan",
  "team",
  "languages",
  "complete",
] as const

type Step = (typeof STEPS)[number]

interface OnboardingWizardProps {
  initialStep?: Step
  userId: string
}

export function OnboardingWizard({
  initialStep = "welcome",
  userId,
}: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(initialStep)
  const [loading, setLoading] = useState(false)

  const currentStepIndex = STEPS.indexOf(currentStep)
  const progress = (currentStepIndex / (STEPS.length - 1)) * 100

  const handleNext = async (data: any = {}) => {
    setLoading(true)
    try {
      // If it's the complete step, just redirect to dashboard
      if (currentStep === "complete") {
        await fetch("/api/onboarding/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step: currentStep,
            data: { completed: true },
          }),
        })
        router.push("/dashboard")
        return
      }

      // Save step data for other steps
      await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: currentStep,
          data,
        }),
      })

      // Move to next step
      const nextIndex = currentStepIndex + 1
      if (nextIndex < STEPS.length) {
        setCurrentStep(STEPS[nextIndex])
      }
    } catch (error) {
      console.error("Error saving onboarding data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    setLoading(true)
    try {
      await fetch("/api/onboarding/skip", {
        method: "POST",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error skipping onboarding:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-8 px-4 py-8">
      <Progress value={progress} className="h-2" />

      <Card className="p-6">
        {currentStep === "welcome" && (
          <WelcomeStep onNext={handleNext} onSkip={handleSkip} />
        )}
        {currentStep === "profile" && (
          <ProfileStep onNext={handleNext} userId={userId} />
        )}
        {currentStep === "plan" && (
          <PlanStep onNext={handleNext} userId={userId} />
        )}
        {currentStep === "team" && (
          <TeamStep onNext={handleNext} userId={userId} />
        )}
        {currentStep === "languages" && (
          <LanguagesStep onNext={handleNext} userId={userId} />
        )}
        {currentStep === "complete" && (
          <CompleteStep onNext={handleNext} userId={userId} />
        )}
      </Card>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleSkip}
          disabled={loading || currentStep === "complete"}
        >
          Skip for now
        </Button>
        <div className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {STEPS.length}
        </div>
      </div>
    </div>
  )
}
