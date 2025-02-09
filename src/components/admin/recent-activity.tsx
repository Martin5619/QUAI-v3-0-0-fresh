"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Activity_v2414 {
  id: string
  user: {
    name: string
    email: string
    image?: string
  }
  type: "login" | "content" | "question" | "course" | "language"
  description: string
  timestamp: string
}

const activities_v2414: Activity_v2414[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      email: "john@example.com",
      image: "/avatars/01.png",
    },
    type: "content",
    description: "Updated English translation for homepage",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    user: {
      name: "Alice Smith",
      email: "alice@example.com",
      image: "/avatars/02.png",
    },
    type: "question",
    description: "Created 15 new math questions",
    timestamp: "10 minutes ago",
  },
  {
    id: "3",
    user: {
      name: "Bob Johnson",
      email: "bob@example.com",
      image: "/avatars/03.png",
    },
    type: "course",
    description: "Published Advanced Physics course",
    timestamp: "25 minutes ago",
  },
  {
    id: "4",
    user: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      image: "/avatars/04.png",
    },
    type: "language",
    description: "Added Hindi language support",
    timestamp: "1 hour ago",
  },
  {
    id: "5",
    user: {
      name: "Mike Brown",
      email: "mike@example.com",
      image: "/avatars/05.png",
    },
    type: "login",
    description: "Logged in from new device",
    timestamp: "2 hours ago",
  },
]

const getActivityColor = (type: Activity_v2414["type"]) => {
  switch (type) {
    case "login":
      return "bg-blue-500"
    case "content":
      return "bg-green-500"
    case "question":
      return "bg-purple-500"
    case "course":
      return "bg-yellow-500"
    case "language":
      return "bg-pink-500"
    default:
      return "bg-gray-500"
  }
}

export const RecentActivity_v2414 = () => {
  return (
    <div className="space-y-8">
      {activities_v2414.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  getActivityColor(activity.type)
                )}
              />
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
            </div>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {activity.timestamp}
          </div>
        </div>
      ))}
    </div>
  )
}
