"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Languages,
  FileText,
  Users,
  Settings,
  BookOpen,
  MessageSquare,
  LineChart,
  Database,
} from "lucide-react"

interface SidebarItem_v2414 {
  title: string
  href: string
  icon: React.ReactNode
}

const sidebarItems_v2414: SidebarItem_v2414[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Languages",
    href: "/admin/languages",
    icon: <Languages className="h-5 w-5" />,
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    title: "Database",
    href: "/admin/database",
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export const AdminSidebar_v2414 = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background">
      <nav className="space-y-1 p-4">
        {sidebarItems_v2414.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
