"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next-intl/client"
import { localeConfig, locales, type Locale } from "@/i18n.config"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguageStore_v2414 } from "@/store/language-store"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

export const LanguageSwitcher_v2414 = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { setLocale, addPreferredLocale } = useLanguageStore_v2414()

  useEffect(() => {
    setLocale(locale as Locale)
    addPreferredLocale(locale as Locale)
  }, [locale, setLocale, addPreferredLocale])

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as Locale)
    addPreferredLocale(newLocale as Locale)
    router.replace(pathname, { locale: newLocale as Locale })
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {localeConfig[locale as Locale].name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem
            key={loc}
            value={loc}
            className={cn(
              "flex items-center gap-2",
              localeConfig[loc].dir === "rtl" ? "text-right" : "text-left"
            )}
            style={{ fontFamily: localeConfig[loc].fontFamily }}
          >
            <span className="text-sm">{localeConfig[loc].name}</span>
            {locale === loc && (
              <span className="text-primary">✓</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
