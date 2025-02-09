"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Brain, Users, BarChart, Shield } from "lucide-react"

export default function FeatureShowcase() {
  const t = useTranslations("landing")

  return (
    <div className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t("features.title")}</h2>
          <p className="text-xl text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-8 bg-background rounded-lg shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary/10 rounded-lg">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-4 text-xl font-semibold">
              {t("features.ai.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("features.ai.description")}
            </p>
          </div>
          <div className="p-8 bg-background rounded-lg shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary/10 rounded-lg">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-4 text-xl font-semibold">
              {t("features.collaboration.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("features.collaboration.description")}
            </p>
          </div>
          <div className="p-8 bg-background rounded-lg shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary/10 rounded-lg">
              <BarChart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-4 text-xl font-semibold">
              {t("features.analytics.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("features.analytics.description")}
            </p>
          </div>
          <div className="p-8 bg-background rounded-lg shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary/10 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-4 text-xl font-semibold">
              {t("features.security.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("features.security.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
