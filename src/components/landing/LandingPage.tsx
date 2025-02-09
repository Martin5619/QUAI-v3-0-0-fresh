import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import BackgroundVideo from '@/components/video/BackgroundVideo'
import { PricingSection } from '@/components/pricing/PricingSection'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center">
          <BackgroundVideo className="absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/25 to-gray-900/50" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
                  <span className="text-white">Revolutionize Learning with</span>
                  <br className="hidden sm:inline" />
                  <span className="text-blue-500">AI-Powered Questions</span>
                </h1>
                <p className="mt-6 text-lg text-white lg:text-xl">
                  QUAi leverages advanced AI to automatically generate engaging questions from your documents, making learning and assessment more effective.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
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
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20"
                    asChild
                  >
                    <a href="/auth/signup">
                      Try Demo
                      <Sparkles className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Right Column - Try Generation Panel */}
              <div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-white">Try Generation</h3>
                    </div>
                    <span className="px-2.5 py-0.5 text-xs font-medium text-primary bg-primary/10 rounded-full">Live</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2.5 bg-gray-700/50 rounded-full w-full animate-pulse"></div>
                    <div className="h-2.5 bg-gray-700/50 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                    Generate Questions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-gray-900/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                No document library? No problem
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                QUAi comes with everything you need to get started. Upload your documents, generate questions, and start learning.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <ArrowRight className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    AI-Powered Question Generation
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7">
                    <p className="flex-auto text-gray-600 dark:text-gray-300">
                      Our advanced AI understands your documents and generates relevant questions automatically.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <ArrowRight className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Customizable Questions
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7">
                    <p className="flex-auto text-gray-600 dark:text-gray-300">
                      Edit, customize, and create your own questions to match your specific needs.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <ArrowRight className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Instant Results
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7">
                    <p className="flex-auto text-gray-600 dark:text-gray-300">
                      Get questions generated instantly, saving you hours of manual work.
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
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between lg:px-8">
          <div className="flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Privacy</a>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} QUAi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
