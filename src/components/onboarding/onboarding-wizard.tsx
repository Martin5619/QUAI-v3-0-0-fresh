'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { WelcomeStep } from "./steps/welcome-step"
import { Role_v3 } from "@prisma/client"

interface OnboardingData {
  role: Role_v3 | ""
}

interface OnboardingWizardProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
  }
}

export function OnboardingWizard({ user }: OnboardingWizardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    role: ""
  })

  const handleUpdate = (newData: Partial<OnboardingData>) => {
    console.log("[ONBOARDING] Updating data:", newData)
    setData(prev => ({ ...prev, ...newData }))
  }

  const handleSubmit = async () => {
    console.log("[ONBOARDING] Submit clicked, current data:", data)
    
    if (!data.role) {
      toast.error("Please select a role to continue")
      return
    }

    try {
      setIsLoading(true)
      console.log("[ONBOARDING] Submitting data:", data)

      // Only send the role to match API expectations
      const payload = {
        role: data.role
      }

      console.log("[ONBOARDING] Formatted payload:", payload)

      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save onboarding data")
      }

      const result = await response.json()
      console.log("[ONBOARDING] Success:", result)

      toast.success("Welcome to QUAi!")
      
      // Force a hard navigation to ensure fresh data
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("[ONBOARDING_ERROR]", error)
      toast.error(error instanceof Error ? error.message : "Failed to complete onboarding")
    } finally {
      setIsLoading(false)
    }
  }

  console.log("[ONBOARDING] Current state:", { data, isLoading })

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <WelcomeStep 
        data={data}
        onUpdate={handleUpdate}
        onNext={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
