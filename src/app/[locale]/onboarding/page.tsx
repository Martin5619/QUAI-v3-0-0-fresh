import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { getOnboardingState_v2414 } from "@/lib/services/onboarding-service"

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")

  // Get or create onboarding state
  const onboardingState = await getOnboardingState_v2414(session.user.id)
  
  // Redirect to dashboard if completed
  if (onboardingState?.status === "completed") {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container relative flex-1 flex flex-col items-center justify-center">
        <OnboardingWizard
          initialStep={onboardingState?.currentStep || "welcome"}
          userId={session.user.id}
        />
      </div>
    </main>
  )
}
