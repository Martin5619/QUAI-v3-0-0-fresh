"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">QUAi</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {session ? (
              <Button
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-semibold text-muted-foreground hover:text-primary"
                  asChild
                >
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white"
                  asChild
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
