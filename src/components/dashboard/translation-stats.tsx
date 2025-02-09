"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface TranslationStatsProps {
  className?: string
  userId: string
}

export function TranslationStats({ className, userId }: TranslationStatsProps) {
  const t = useTranslations("dashboard.stats")

  // This would typically be fetched from an API
  const stats = {
    projects: 5,
    translations: 128,
    reviews: 64,
    comments: 32,
  }

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Icons.folder className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("projects")}</h3>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.projects}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("translations")}</h3>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.translations}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Icons.checkSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("reviews")}</h3>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.reviews}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Icons.messageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("comments")}</h3>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stats.comments}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
