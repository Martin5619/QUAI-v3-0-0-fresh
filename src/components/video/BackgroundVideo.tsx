'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface BackgroundVideoProps {
  className?: string
}

export default function BackgroundVideo({ className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('[VIDEO_PLAY_ERROR]', error)
      })
    }
  }, [])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="w-full h-full relative">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
        >
          <source src="/api/video" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </div>
  )
}
