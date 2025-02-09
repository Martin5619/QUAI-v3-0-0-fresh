"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function HeroSection() {
  const t = useTranslations("landing")

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <h1 className="mb-6 text-4xl md:text-6xl font-bold font-heading tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="mb-8 text-lg md:text-xl text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  {t("hero.cta.primary")}
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/signin">
                  {t("hero.cta.secondary")}
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div className="relative">
              <img
                className="relative mx-auto rounded-lg shadow-lg"
                src="/images/hero-screenshot.png"
                alt="QUAi Dashboard Screenshot"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-background/0 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
