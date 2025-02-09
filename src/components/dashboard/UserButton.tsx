'use client'

import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { User_v2414 } from '@prisma/client'

export function UserButton() {
  const { data: session } = useSession()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  // Reset error state when session changes
  useEffect(() => {
    if (session?.user?.image) {
      setImageError(false)
    }
  }, [session?.user?.image])

  if (!session?.user) {
    return null
  }

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {!imageError && user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name || 'User avatar'}
                className="object-cover"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            )}
            <AvatarFallback>
              {user.name
                ? user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings_v2414')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
