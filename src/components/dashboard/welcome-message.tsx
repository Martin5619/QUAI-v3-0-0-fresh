"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface WelcomeMessageProps {
  className?: string
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    firstName?: string | null
    lastName?: string | null
    isFirstVisit?: boolean
  }
}

export function WelcomeMessage({
  className,
  user,
}: WelcomeMessageProps) {
  const firstName = user.firstName || user.name?.split(' ')[0] || 'User'
  const lastName = user.lastName || user.name?.split(' ').slice(1).join(' ') || ''
  const isFirstVisit = user.isFirstVisit || false

  return (
    <Card className={cn("w-full", className)}>
      <div className="flex items-center space-x-4 p-6">
        <Avatar className="h-12 w-12">
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
          <h2 className="text-2xl font-semibold">
            {isFirstVisit ? 'Welcome to QUAi' : `Welcome back, ${firstName} ${lastName}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isFirstVisit 
              ? 'Create questions, load documents, and test yourself!' 
              : "Here's an overview of your recent activity and quick actions."}
          </p>
        </div>
      </div>
    </Card>
  )
}
