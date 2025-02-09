"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Icons.logo,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: Icons.post,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Icons.settings,
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
