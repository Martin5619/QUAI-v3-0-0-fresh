"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  image?: string
  status: "online" | "offline" | "busy"
  recentProject?: string
}

interface TeamOverviewProps {
  className?: string
  userId: string
}

export function TeamOverview({ className, userId }: TeamOverviewProps) {
  const t = useTranslations("dashboard.team")

  // This would typically be fetched from an API
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Translator",
      image: "/avatars/john.jpg",
      status: "online",
      recentProject: "Website Localization",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Reviewer",
      image: "/avatars/jane.jpg",
      status: "busy",
      recentProject: "Mobile App Strings",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Project Manager",
      status: "offline",
      recentProject: "Documentation",
    },
  ]

  const statusColor = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    busy: "bg-yellow-500",
  }

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("title")}</CardTitle>
        <Button variant="outline" size="sm">
          <Icons.userPlus className="mr-2 h-4 w-4" />
          {t("inviteMember")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {member.recentProject && (
                  <div className="hidden text-sm text-muted-foreground md:block">
                    {member.recentProject}
                  </div>
                )}
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    statusColor[member.status]
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
