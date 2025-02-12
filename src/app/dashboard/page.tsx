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

  // Check onboarding state
  const onboardingState = await db.onboardingState_v3.findUnique({
    where: { userId: session.user.id }
  })

  if (!onboardingState?.isComplete) {
    redirect("/onboarding")
  }

  // Get user's documents
  const documents = await db.document_v3.findMany({
    where: { userId: session.user.id },
    select: { id: true, title: true }
  })

  // Get user's usage data
  const usage = await db.usage_v3.findUnique({
    where: { userId: session.user.id }
  }) || {
    documentsUsed: 0,
    questionsGenerated: 0,
    storageUsed: 0,
    tokensUsed: 0
  }

  // Get user's plan limits
  const subscription = await db.subscription_v3.findUnique({
    where: { userId: session.user.id }
  })

  const planLimits = subscription?.plan === "PRO" ? {
    documents: 50,
    questions: Infinity,
    storage: 1024 * 1024 * 1024, // 1GB
    tokens: 10000
  } : {
    documents: 3,
    questions: 50,
    storage: 100 * 1024 * 1024, // 100MB
    tokens: 1000
  }

  const usageMetrics = [
    {
      label: "Documents",
      current: usage.documentsUsed,
      max: planLimits.documents,
      color: "text-blue-500",
      tooltip: "Number of documents uploaded this month"
    },
    {
      label: "Questions",
      current: usage.questionsGenerated,
      max: planLimits.documents === Infinity ? 1000 : planLimits.questions,
      color: "text-green-500",
      tooltip: "Questions generated this month"
    },
    {
      label: "Storage",
      current: Math.round(usage.storageUsed / (1024 * 1024)), // Convert to MB
      max: Math.round(planLimits.storage / (1024 * 1024)), // Convert to MB
      color: "text-purple-500",
      tooltip: "Storage space used in MB"
    },
    {
      label: "Tokens",
      current: usage.tokensUsed,
      max: planLimits.tokens,
      color: "text-orange-500",
      tooltip: "AI tokens used this month"
    }
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to QUAi! Here's an overview of your documents and questions."
      />
      <div className="space-y-6">
        {/* Welcome Message - Full Width */}
        <WelcomeMessage
          user={{
            ...session.user,
            isFirstVisit: !onboardingState?.hasViewedDashboard
          }}
        />

        {/* Usage Circles - Full Width */}
        <UsageCircles metrics={usageMetrics} />

        {/* Quick Actions - Full Width */}
        <QuickActionCenter
          userId={session.user.id}
          recentDocuments={documents}
        />

        {/* Recent Activity Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentsOverview
            userId={session.user.id}
          />
          <RecentQuestions
            userId={session.user.id}
          />
        </div>

        {/* Upgrade Card - Full Width */}
        <UpgradeCard plan={session.user.plan || 'free'} />
      </div>
    </DashboardShell>
  )
}
