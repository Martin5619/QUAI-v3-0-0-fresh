import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WelcomeMessage } from "@/components/dashboard/welcome-message"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { TeamOverview } from "@/components/dashboard/team-overview"
import { TranslationStats } from "@/components/dashboard/translation-stats"
import { getWelcomeChecklist_v2414 } from "@/lib/services/onboarding-service"
import { getRecentActivity_v2414 } from "@/lib/services/user-settings-service"
import { useTranslations } from "next-intl"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")
  if (!session.user.onboarded) redirect("/onboarding")

  const [checklist, activity] = await Promise.all([
    getWelcomeChecklist_v2414(session.user.id),
    getRecentActivity_v2414(session.user.id),
  ])

  const t = useTranslations("dashboard")

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t("title")}
        text={t("subtitle")}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WelcomeMessage
          className="col-span-4"
          user={session.user}
          checklist={checklist}
        />
        <TranslationStats className="col-span-3" userId={session.user.id} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ProjectsOverview
          className="col-span-4"
          userId={session.user.id}
        />
        <RecentActivity
          className="col-span-3"
          activity={activity}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <TeamOverview
          className="col-span-4"
          userId={session.user.id}
        />
      </div>
    </DashboardShell>
  )
}
