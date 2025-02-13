import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DocumentPageContent } from "@/components/documents/DocumentPageContent"

export default async function DocumentsPage() {
  const session = await getServerSession()
  if (!session?.user) redirect("/auth/signin")

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Documents"
        text="Upload, manage, and organize your documents."
      />
      <DocumentPageContent />
    </DashboardShell>
  )
}
