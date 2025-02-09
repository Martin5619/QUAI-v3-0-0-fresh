"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "pricing.tiers.free.name",
    description: "pricing.tiers.free.description",
    price: "pricing.tiers.free.price",
    features: [
      "pricing.tiers.free.features.f1",
      "pricing.tiers.free.features.f2",
      "pricing.tiers.free.features.f3",
      "pricing.tiers.free.features.f4",
    ],
    cta: "pricing.tiers.free.cta",
    href: "/auth/signup",
  },
  {
    name: "pricing.tiers.pro.name",
    description: "pricing.tiers.pro.description",
    price: "pricing.tiers.pro.price",
    features: [
      "pricing.tiers.pro.features.f1",
      "pricing.tiers.pro.features.f2",
      "pricing.tiers.pro.features.f3",
      "pricing.tiers.pro.features.f4",
      "pricing.tiers.pro.features.f5",
    ],
    cta: "pricing.tiers.pro.cta",
    href: "/auth/signup?plan=pro",
    featured: true,
  },
  {
    name: "pricing.tiers.enterprise.name",
    description: "pricing.tiers.enterprise.description",
    price: "pricing.tiers.enterprise.price",
    features: [
      "pricing.tiers.enterprise.features.f1",
      "pricing.tiers.enterprise.features.f2",
      "pricing.tiers.enterprise.features.f3",
      "pricing.tiers.enterprise.features.f4",
      "pricing.tiers.enterprise.features.f5",
    ],
    cta: "pricing.tiers.enterprise.cta",
    href: "/contact",
  },
]

export default function PricingSection() {
  const t = useTranslations("landing")

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t("pricing.title")}</h2>
          <p className="text-xl text-muted-foreground">
            {t("pricing.subtitle")}
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col p-8 bg-background rounded-lg shadow-lg",
                tier.featured && "ring-2 ring-primary"
              )}
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{t(tier.name)}</h3>
                <p className="mt-4 text-muted-foreground">
                  {t(tier.description)}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-bold">{t(tier.price)}</span>
                </p>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Icons.check className="w-5 h-5 text-primary mr-3" />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                asChild
                className="mt-8"
                variant={tier.featured ? "default" : "outline"}
              >
                <Link href={tier.href}>{t(tier.cta)}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
