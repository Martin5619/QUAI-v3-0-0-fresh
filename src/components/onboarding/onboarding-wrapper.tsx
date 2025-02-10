'use client'

import { OnboardingWizard } from "./onboarding-wizard"

interface OnboardingWrapperProps {
  user: any
}

export function OnboardingWrapper({ user }: OnboardingWrapperProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background">
      <OnboardingWizard user={user} />
    </main>
  )
}
