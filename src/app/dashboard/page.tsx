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

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect("/auth/signin")

  // Check onboarding state
  const onboardingState = await db.onboardingState_v3.findUnique({
    where: { userId: session.user.id }
  })

  if (!onboardingState?.isComplete) {
    redirect("/onboarding")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to QUAi! Here's an overview of your documents and questions."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WelcomeMessage
          className="col-span-4"
          user={session.user}
        />
        <UsageMetrics 
          className="col-span-3" 
          userId={session.user.id} 
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DocumentsOverview
          className="col-span-4"
          userId={session.user.id}
        />
        <div className="col-span-3 space-y-4">
          <RecentQuestions
            userId={session.user.id}
          />
          <UpgradeCard plan={session.user.plan || 'free'} />
        </div>
      </div>
    </DashboardShell>
  )
}
