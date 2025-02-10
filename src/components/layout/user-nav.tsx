"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"

interface UserNavProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to sign out")
      }

      router.push("/auth/signin")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

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
        onClick={handleSignOut}
      >
        <Icons.logout className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  )
}
