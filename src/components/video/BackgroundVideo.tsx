'use client'

import { cn } from '@/lib/utils'

interface BackgroundVideoProps {
  className?: string
}

export default function BackgroundVideo({ className }: BackgroundVideoProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="w-full h-full relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/video-poster.jpg"
        >
          <source src={process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '/hero-video.mp4'} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}
