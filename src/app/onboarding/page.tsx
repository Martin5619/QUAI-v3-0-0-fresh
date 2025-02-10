'use server'

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { OnboardingWrapper } from "@/components/onboarding/onboarding-wrapper"

export default async function OnboardingPage() {
  const session = await auth()
    
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return <OnboardingWrapper user={session.user} />
}
