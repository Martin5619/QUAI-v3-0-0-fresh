"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "translation" | "review" | "comment" | "project"
  user: {
    name: string
    email: string
    image?: string
  }
  project: string
  description: string
  timestamp: string
}

interface RecentActivityProps {
  className?: string
  userId: string
}

export function RecentActivity({ className, userId }: RecentActivityProps) {
  const t = useTranslations("dashboard.activity")

  // This would typically be fetched from an API
  const activities: Activity[] = [
    {
      id: "1",
      type: "translation",
      user: {
        name: "John Doe",
        email: "john@example.com",
        image: "/avatars/john.jpg",
      },
      project: "Website Localization",
      description: "Translated 50 strings to Spanish",
      timestamp: "2024-02-08T16:45:00Z",
    },
    {
      id: "2",
      type: "review",
      user: {
        name: "Jane Smith",
        email: "jane@example.com",
        image: "/avatars/jane.jpg",
      },
      project: "Mobile App Strings",
      description: "Reviewed German translations",
      timestamp: "2024-02-08T15:30:00Z",
    },
    {
      id: "3",
      type: "comment",
      user: {
        name: "Mike Johnson",
        email: "mike@example.com",
      },
      project: "Documentation",
      description: "Added a comment on string #123",
      timestamp: "2024-02-08T14:15:00Z",
    },
  ]

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "translation":
        return <Icons.fileText className="h-4 w-4" />
      case "review":
        return <Icons.checkSquare className="h-4 w-4" />
      case "comment":
        return <Icons.messageSquare className="h-4 w-4" />
      case "project":
        return <Icons.folder className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "just now"
  }

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={activity.user.image}
                  alt={activity.user.name}
                />
                <AvatarFallback>
                  {activity.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  {getActivityIcon(activity.type)}
                  <span>{activity.project}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
