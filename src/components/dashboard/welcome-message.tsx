"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface WelcomeMessageProps {
  className?: string
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  checklist: {
    total: number
    completed: number
    items: {
      id: string
      title: string
      completed: boolean
      href: string
    }[]
  }
}

export function WelcomeMessage({
  className,
  user,
  checklist,
}: WelcomeMessageProps) {
  const t = useTranslations("dashboard.welcome")
  const progress = (checklist.completed / checklist.total) * 100

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image || ""} alt={user.name || ""} />
          <AvatarFallback>
            {user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || user.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <CardTitle>
            {t("title", { name: user.name || user.email?.split("@")[0] })}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {t("description")}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>Setup Progress</div>
              <div className="text-muted-foreground">
                {checklist.completed}/{checklist.total} tasks
              </div>
            </div>
            <Progress value={progress} />
          </div>
          <div className="grid gap-2">
            {checklist.items.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <a href={item.href}>
                  {item.completed ? (
                    <Icons.check className="mr-2 h-4 w-4 text-primary" />
                  ) : (
                    <Icons.circle className="mr-2 h-4 w-4" />
                  )}
                  <span className={cn(item.completed && "line-through")}>
                    {t(`tasks.${item.id}`)}
                  </span>
                </a>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
