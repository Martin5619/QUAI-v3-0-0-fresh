"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle_v2414 } from "@/components/theme-toggle"
import { LocaleToggle_v2414 } from "@/components/locale-toggle"

export default function Navbar() {
  const t = useTranslations("common")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">QUAi</span>
          </Link>
        </div>

        <nav className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex items-center space-x-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t("pricing")}
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t("docs")}
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle_v2414 />
            <LocaleToggle_v2414 />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">{t("signup")}</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
