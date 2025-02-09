import { AdminSidebar_v2414 } from "@/components/admin/sidebar"
import { AdminHeader_v2414 } from "@/components/admin/header"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions_v2414 } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions_v2414)

  if (!session?.user || session.user.role_v2414 !== "SUPER_ADMIN") {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader_v2414 />
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar_v2414 />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
