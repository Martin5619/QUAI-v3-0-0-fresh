'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { WelcomeStep } from "./steps/welcome-step"
import { ProfileStep } from "./steps/profile-step"
import { PreferencesStep } from "./steps/preferences-step"
import { PlanStep } from "./steps/plan-step"
import { UsageStep } from "./steps/usage-step"
import { toast } from "@/components/ui/use-toast"
import { Role_v3, Plan_v3 } from "@prisma/client"

interface OnboardingData {
  role: Role_v3 | string
  firstName?: string
  lastName?: string
  avatar?: string
  preferences?: {
    theme?: string
    language?: string
    notifications?: boolean
  }
  plan: Plan_v3 | string
  usage: {
    documents: number
    questions: number
    storage: number
    tokens: number
  }
}

interface OnboardingWizardProps {
  user: any
}

export function OnboardingWizard({ user }: OnboardingWizardProps) {
  const router = useRouter()
  const [state, setState] = React.useState({
    step: 0,
    data: {
      role: user?.role || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      avatar: user?.image || "",
      preferences: {
        theme: "light",
        language: "en",
        notifications: "important"
      },
      plan: (user?.plan || "FREE").toLowerCase() as Plan_v3,
      usage: {
        documents: 0,
        questions: 0,
        storage: 0,
        tokens: 0
      }
    } as OnboardingData,
    isLoading: false
  })

  console.log("[ONBOARDING] Current state:", state)

  const handleDataUpdate = (data: Partial<OnboardingData>) => {
    console.log("[ONBOARDING] Updating data:", data)
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...data }
    }))
  }

  const handleRoleSubmit = async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: state.data.role })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setState(prev => ({
        ...prev,
        step: prev.step + 1,
        isLoading: false
      }))
    } catch (error) {
      console.error("[ONBOARDING_ERROR]", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save role",
        variant: "destructive"
      })
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleProfileSubmit = async (data: OnboardingData) => {
    console.log("[ONBOARDING] Submitting profile:", {
      firstName: data.firstName,
      lastName: data.lastName
    })

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[ONBOARDING_ERROR] Profile update failed:", error)
        throw new Error(error || "Failed to update profile")
      }

      const result = await response.json()
      console.log("[ONBOARDING] Profile updated:", result)

      setState(prev => ({
        ...prev,
        step: prev.step + 1,
        isLoading: false
      }))
    } catch (error) {
      console.error("[ONBOARDING_ERROR]", error)
      setState(prev => ({ ...prev, isLoading: false }))
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
      throw error
    }
  }

  const handlePreferencesSubmit = async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: state.data.preferences })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setState(prev => ({
        ...prev,
        step: prev.step + 1,
        isLoading: false
      }))
    } catch (error) {
      console.error("[ONBOARDING_ERROR]", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save preferences",
        variant: "destructive"
      })
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handlePlanSubmit = async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: state.data.plan })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setState(prev => ({
        ...prev,
        step: prev.step + 1,
        isLoading: false
      }))
    } catch (error) {
      console.error("[ONBOARDING_ERROR]", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save plan",
        variant: "destructive"
      })
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleUsageSubmit = async (usageData: any) => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const response = await fetch('/api/user/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: state.data.role,
          preferences: state.data.preferences,
          plan: (state.data.plan || 'FREE').toUpperCase(),
          usage: {
            documentsCount: usageData.documents || 0,
            questionsCount: usageData.questions || 0,
            storageUsed: usageData.storage || 0,
            tokensUsed: usageData.tokens || 0
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      // Redirect to dashboard on success
      router.push('/dashboard')
    } catch (error) {
      console.error('[ONBOARDING_SUBMIT_ERROR]', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete onboarding",
        variant: "destructive"
      })
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleNext = async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      switch (state.step) {
        case 0: // Welcome
          setState(prev => ({ ...prev, step: prev.step + 1, isLoading: false }))
          break
        case 1: // Profile
          await handleProfileSubmit(state.data)
          break
        case 2: // Preferences
          // Update preferences in state and move to next step
          setState(prev => ({ 
            ...prev, 
            step: prev.step + 1,
            isLoading: false
          }))
          break
        case 3: // Plan
          await handlePlanSubmit()
          break
        case 4: // Usage
          await handleUsageSubmit(state.data.usage)
          break
        default:
          console.error('Unknown step:', state.step)
      }
    } catch (error) {
      console.error('Error in handleNext:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return (
          <WelcomeStep
            data={{ role: state.data.role }}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            isLoading={state.isLoading}
          />
        )
      case 1:
        return (
          <ProfileStep
            data={state.data}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            isLoading={state.isLoading}
          />
        )
      case 2:
        return (
          <PreferencesStep
            data={state.data}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            isLoading={state.isLoading}
          />
        )
      case 3:
        return (
          <PlanStep
            data={state.data}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            isLoading={state.isLoading}
          />
        )
      case 4:
        return (
          <UsageStep
            data={state.data}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            isLoading={state.isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-10">
        {renderStep()}
      </div>
    </div>
  )
}
