"use client"

/**
 * @component LandingPage
 * @type Client Component
 * @uses React Hooks: useState, useEffect
 * @requires "use client" directive
 * @description Landing page component with interactive features and video modal
 */

import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Moon, Sun } from 'lucide-react'
import BackgroundVideo from '@/components/video/BackgroundVideo'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PersonaFeatures } from '@/components/landing/PersonaFeatures'
import { Footer } from '@/components/landing/Footer'
import { useTheme } from 'next-themes'
import { PricingSection } from '@/components/pricing/PricingSection'

export function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [demoText, setDemoText] = useState('')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="relative">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <a href="/" className="flex items-center">
                  <span className="text-xl font-bold text-white">QUAi</span>
                </a>
              </div>
              <div className="flex gap-4 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="relative w-9 h-9 text-white hover:bg-white/10"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
                  asChild
                >
                  <a href="/auth/signin">Sign In</a>
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  asChild
                >
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center">
          <BackgroundVideo className="absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="text-white space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-white">Transform Learning with</span>
                  <br className="hidden sm:inline" />
                  <span className="text-purple-500">AI-Powered Intelligence</span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed">
                  Harness the power of AI to create dynamic, engaging questions that adapt to your learning style. Experience the future of education with intelligent question generation and personalized learning paths.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                    asChild
                  >
                    <a href="/signup">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20"
                    onClick={() => setIsVideoOpen(true)}
                  >
                    Watch Demo
                    <Play className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Right Column - Demo Generator */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white shadow-2xl border border-white/20">
                <h3 className="text-2xl font-semibold mb-6">
                  Try Our Question Generator
                </h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter any topic or paste your text..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    value={demoText}
                    onChange={(e) => setDemoText(e.target.value)}
                  />
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!demoText}
                  >
                    Generate Questions
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Dialog */}
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="sm:max-w-[800px] p-0 bg-black">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || "https://www.youtube.com/embed/default-video-id"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Persona-based Features Section */}
        <PersonaFeatures />

        {/* Everything You Need Section */}
        <section className="bg-white dark:bg-gray-900/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything You Need
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Discover how QUAi empowers different learning paths with tailored features and capabilities
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {/* Personal Learning */}
                <div className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                    Personal Growth
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">
                      Take control of your learning journey with personalized question generation,
                      adaptive learning paths, and real-time progress tracking.
                    </p>
                    <p className="mt-6">
                      <Button
                        variant="link"
                        className="text-purple-600 dark:text-purple-400"
                        asChild
                      >
                        <a href="/auth/signup?type=personal">
                          Learn more <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </p>
                  </dd>
                </div>

                {/* Teachers */}
                <div className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                    Educators
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">
                      Transform your teaching with AI-powered question generation, student analytics,
                      and comprehensive class management tools.
                    </p>
                    <p className="mt-6">
                      <Button
                        variant="link"
                        className="text-purple-600 dark:text-purple-400"
                        asChild
                      >
                        <a href="/auth/signup?type=teacher">
                          Learn more <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </p>
                  </dd>
                </div>

                {/* Corporate */}
                <div className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                    Enterprise
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">
                      Scale your organization's learning programs with advanced analytics,
                      compliance tracking, and customizable learning paths.
                    </p>
                    <p className="mt-6">
                      <Button
                        variant="link"
                        className="text-purple-600 dark:text-purple-400"
                        asChild
                      >
                        <a href="/auth/signup?type=corporate">
                          Learn more <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
