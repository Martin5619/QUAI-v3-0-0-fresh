'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2Icon, SaveIcon, XIcon } from 'lucide-react'

interface BackgroundVideoProps {
  className?: string
}

export default function BackgroundVideo({ className = '' }: BackgroundVideoProps) {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [videoUrl, setVideoUrl] = useState('https://player.vimeo.com/video/824804225')
  const [editedUrl, setEditedUrl] = useState(videoUrl)

  // Load saved video URL from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('backgroundVideoUrl')
    if (savedUrl) {
      setVideoUrl(savedUrl)
      setEditedUrl(savedUrl)
    }
  }, [])

  const handleSave = () => {
    setVideoUrl(editedUrl)
    localStorage.setItem('backgroundVideoUrl', editedUrl)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedUrl(videoUrl)
    setIsEditing(false)
  }

  const isAdmin = session?.user?.role === 'SUPER_ADMIN'

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={`${videoUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
          className="w-full h-full scale-[1.75]"
          allow="autoplay; fullscreen"
          style={{ border: 'none' }}
        />
      </div>
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2">
          {isEditing ? (
            <>
              <Input
                type="text"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                className="bg-white/90 w-96"
                placeholder="Enter Vimeo video URL"
              />
              <Button size="icon" variant="default" onClick={handleSave}>
                <SaveIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={handleCancel}>
                <XIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="icon" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2Icon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      {/* Removed duplicate gradient overlay since it's handled in LandingPage.tsx */}
    </div>
  )
}
