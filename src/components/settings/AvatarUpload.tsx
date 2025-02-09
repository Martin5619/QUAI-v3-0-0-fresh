'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

interface AvatarUploadProps {
  onAvatarChange: (imageUrl: string) => Promise<void>
}

export function AvatarUpload({ onAvatarChange }: AvatarUploadProps) {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarFallback>
          {session?.user?.name?.[0] || 'U'}
        </AvatarFallback>
      </Avatar>
      <Button variant="outline" disabled>
        Avatar uploads not supported
      </Button>
    </div>
  )
}
