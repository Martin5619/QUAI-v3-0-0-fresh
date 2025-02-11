'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface BackgroundVideoProps {
  className?: string
}

type VideoSource = {
  type: 'youtube' | 'remote' | 'local'
  url: string
}

export default function BackgroundVideo({ className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | HTMLIFrameElement>(null)
  const [videoSource, setVideoSource] = useState<VideoSource>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    // Fetch video source configuration from API
    fetch('/api/video')
      .then(res => res.json())
      .then(data => setVideoSource(data))
      .catch(err => {
        console.error('[VIDEO_CONFIG_ERROR]', err)
        // Fallback to YouTube if config fails
        setVideoSource({
          type: 'youtube',
          url: 'dQw4w9WgXcQ'
        })
      })
  }, [])

  if (!videoSource) {
    return null
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="w-full h-full relative">
        {videoSource.type === 'youtube' ? (
          <iframe
            ref={videoRef as React.RefObject<HTMLIFrameElement>}
            className="absolute inset-0 w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${videoSource.url}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoSource.url}&rel=0`}
            title="Background Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          />
        ) : (
          <video
            ref={videoRef as React.RefObject<HTMLVideoElement>}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-poster.jpg"
            onError={(e) => {
              console.error('[VIDEO_PLAY_ERROR]', e)
              setError('Failed to load video')
            }}
          >
            <source src={videoSource.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </div>
  )
}
