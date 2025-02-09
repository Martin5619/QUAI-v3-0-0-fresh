"use client"

import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface UserNavProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8 rounded-full"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
          <AvatarFallback>
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || user?.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <Icons.logout className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  )
}
