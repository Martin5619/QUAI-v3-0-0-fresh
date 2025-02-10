'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { WelcomeStep } from "./steps/welcome-step"
import { ProfileStep } from "./steps/profile-step"
import { PreferencesStep } from "./steps/preferences-step"
import { PlanSelectionStep } from "./steps/plan-selection-step"
import { UsageOverviewStep } from "./steps/usage-overview-step"
import { CompletionStep } from "./steps/completion-step"

interface OnboardingWizardProps {
  user: any
  initialState?: any
}

export function OnboardingWizard({ user, initialState }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    role: '',
    name: user?.name || '',
    avatar: user?.image || '',
    preferences: {},
    plan: 'free',
  })

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    window.location.href = '/'
  }

  const steps = [
    {
      title: "Welcome",
      component: WelcomeStep,
      props: {
        onNext: (stepData: any) => {
          setData({ ...data, ...stepData })
          setStep(step + 1)
        },
        onSkip: () => setStep(step + 1)
      }
    },
    {
      title: "Profile",
      component: ProfileStep,
      props: {
        initialData: {
          name: data.name,
          avatar: data.avatar
        },
        onNext: (stepData: any) => {
          setData({ ...data, ...stepData })
          setStep(step + 1)
        },
        onBack: () => setStep(step - 1)
      }
    },
    {
      title: "Preferences",
      component: PreferencesStep,
      props: {
        onNext: (stepData: any) => {
          setData({ ...data, ...stepData })
          setStep(step + 1)
        },
        onBack: () => setStep(step - 1)
      }
    },
    {
      title: "Plan",
      component: PlanSelectionStep,
      props: {
        onNext: (stepData: any) => {
          setData({ ...data, ...stepData })
          setStep(step + 1)
        },
        onBack: () => setStep(step - 1)
      }
    },
    {
      title: "Usage",
      component: UsageOverviewStep,
      props: {
        data: data,
        onNext: (stepData: any) => {
          setData({ ...data, ...stepData })
          setStep(step + 1)
        },
        onBack: () => setStep(step - 1)
      }
    },
    {
      title: "Complete",
      component: CompletionStep,
      props: {
        data: data,
        onComplete: async () => {
          // Save all data and redirect to dashboard
          try {
            await fetch('/api/user/onboarding', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            window.location.href = '/dashboard'
          } catch (error) {
            console.error('Failed to save onboarding data:', error)
          }
        }
      }
    }
  ]

  const currentStep = steps[step]
  const StepComponent = currentStep.component
  const progress = ((step + 1) / steps.length) * 100

  return (
    <Card className="w-full max-w-3xl p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground"
          >
            Sign Out
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <StepComponent {...currentStep.props} />
    </Card>
  )
}
