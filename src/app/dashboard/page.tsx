import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WelcomeMessage } from "@/components/dashboard/welcome-message"
import { DocumentsOverview } from "@/components/dashboard/documents-overview"
import { UsageMetrics } from "@/components/dashboard/usage-metrics"
import { RecentQuestions } from "@/components/dashboard/recent-questions"
import { UpgradeCard } from "@/components/dashboard/upgrade-card"
import { QuickActionCenter } from "@/components/dashboard/actions/quick-action-center"
import { UsageCircles } from "@/components/dashboard/usage/usage-circles"

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect("/auth/signin")

  // Get both user and onboarding state
  const [user, onboardingState] = await Promise.all([
    db.user_v3.findUnique({
      where: { id: session.user.id }
    }),
    db.onboardingState_v3.findUnique({
      where: { userId: session.user.id }
    })
  ])

  // Redirect to onboarding if:
  // 1. No onboarding state exists
  // 2. Onboarding is not complete
  // 3. User's account state is not ACTIVE
  if (!onboardingState?.isComplete || user?.accountState !== "ACTIVE") {
    redirect("/onboarding")
  }

  // Get user's documents and usage data
  const [documents, usage] = await Promise.all([
    db.document_v3.findMany({
      where: { userId: session.user.id },
      select: { id: true, title: true }
    }),
    db.usage_v3.findUnique({
      where: { userId: session.user.id }
    })
  ])

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your personalized dashboard."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WelcomeMessage
          className="col-span-4"
          user={user}
        />
        
        <DocumentsOverview 
          className="col-span-3"
          documents={documents}
        />

        <UsageMetrics
          className="col-span-2"
          usage={usage}
        />

        <RecentQuestions
          className="col-span-2"
          userId={session.user.id}
        />

        {user?.plan === "FREE" && (
          <UpgradeCard className="col-span-3" />
        )}

        <QuickActionCenter className="col-span-4" />
        
        <UsageCircles
          className="col-span-3"
          usage={usage}
          plan={user?.plan}
        />
      </div>
    </DashboardShell>
  )
}
