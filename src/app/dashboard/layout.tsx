import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { SiteFooter } from "@/components/layout/site-footer"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <UserNav
            user={{
              name: session.user.name,
              image: session.user.image,
              email: session.user.email,
            }}
          />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
