'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react'
import BackgroundVideo from '@/components/video/BackgroundVideo'
import VideoModal from '@/components/video/VideoModal'
import { useState } from 'react'

export default function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="relative min-h-[85vh] flex items-center">
      <BackgroundVideo className="absolute inset-0 -z-10" />
      <div className="py-24 px-4 mx-auto max-w-screen-xl text-center lg:py-32 lg:px-12 relative z-10">
        <div className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-200 bg-gray-800/50 backdrop-blur-sm rounded-full hover:bg-gray-700/50" role="alert">
          <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
          <span className="text-sm font-medium">QUAi v3.0 is out! See what's new</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
          Transform Your Documents into
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> Interactive Questions</span>
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 xl:px-48">
          QUAi leverages advanced AI to automatically generate engaging questions from your documents, making learning and assessment more effective.
        </p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Button
            size="lg"
            className="inline-flex justify-center items-center"
            asChild
          >
            <a href="/auth/signin">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="inline-flex justify-center items-center bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={() => setIsVideoOpen(true)}
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  )
}
