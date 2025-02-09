import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LearningProgress } from "@/components/dashboard/personal/learning-progress"
import { StudyRecommendations } from "@/components/dashboard/personal/study-recommendations"
import { PracticeGoals } from "@/components/dashboard/personal/practice-goals"
import { LearningAnalytics } from "@/components/dashboard/personal/learning-analytics"
import { QuickAccess } from "@/components/dashboard/quick-access"
import { Role_v2414 } from "@/lib/types"

export default async function PersonalDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")
  if (!session.user.onboarded) redirect("/onboarding")
  if (session.user.role_v2414 !== Role_v2414.PERSONAL) {
    redirect("/dashboard")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Personal Learning Dashboard"
        text="Track your progress and continue your learning journey."
      >
        <div className="flex items-center space-x-2">
          <div className="grid gap-1 text-sm">
            <p className="font-medium">Free Plan</p>
            <p className="text-muted-foreground">100 questions/month</p>
          </div>
        </div>
      </DashboardHeader>

      <QuickAccess plan="free" />

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <LearningProgress
          className="col-span-4"
          userId={session.user.id}
        />
        <StudyRecommendations
          className="col-span-3"
          userId={session.user.id}
        />
      </div>

      <div className="mt-6">
        <LearningAnalytics
          userId={session.user.id}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PracticeGoals
          className="col-span-4"
          userId={session.user.id}
        />
      </div>

      <div className="mt-6 rounded-lg border bg-muted p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Our AI tutor is here to assist you with your learning journey.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Ask AI Tutor
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
