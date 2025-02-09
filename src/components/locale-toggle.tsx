"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function LocaleToggle_v2414() {
  const locale = useLocale()
  const router = useRouter()

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "es" : "en"
    router.push(`/${newLocale}${window.location.pathname.substring(3)}`)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleLocale}>
      <span className="font-medium">{locale.toUpperCase()}</span>
      <Icons.ChevronDown className="ml-1 h-4 w-4" />
    </Button>
  )
}
