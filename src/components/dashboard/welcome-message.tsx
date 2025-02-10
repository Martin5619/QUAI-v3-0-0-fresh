"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface WelcomeMessageProps {
  className?: string
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function WelcomeMessage({
  className,
  user,
}: WelcomeMessageProps) {
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
          <CardTitle className="text-2xl">
            Welcome back, {user.name || "User"}!
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Here's an overview of your QUAi usage and recent activity.
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
