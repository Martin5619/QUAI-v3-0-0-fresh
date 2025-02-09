'use client'

import { usePathname } from 'next/navigation'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  const isSignIn = pathname === '/auth/sign-in'

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative flex items-center justify-center w-full p-12">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-6">
              {isSignIn ? 'Welcome back to QUAi' : 'Join QUAi Today'}
            </h1>
            <p className="text-lg text-primary-100">
              {isSignIn
                ? 'Sign in to continue your journey with QUAi. Generate questions, create assessments, and track progress with ease.'
                : 'Create your account and start transforming your documents into interactive questions with AI-powered technology.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
    </div>
  )
}
