'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerificationSuccessPage() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const autoSignInAndRedirect = async () => {
      try {
        // Get stored credentials
        const storedData = sessionStorage.getItem('pendingSignup')
        if (!storedData) {
          throw new Error('No stored credentials found')
        }

        const { email, password } = JSON.parse(storedData)

        // Auto sign-in
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: '/onboarding'
        })

        if (result?.error) {
          throw new Error(result.error)
        }

        // Clear stored credentials
        sessionStorage.removeItem('pendingSignup')

        // Redirect to onboarding
        router.push('/onboarding')
      } catch (err) {
        console.error('Auto sign-in failed:', err)
        setError('Failed to automatically sign you in')
        setIsRedirecting(false)
      }
    }

    autoSignInAndRedirect()
  }, [router])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.check className="h-6 w-6 text-green-500" />
            Email Verified Successfully
          </CardTitle>
          <CardDescription>
            {isRedirecting 
              ? 'Email verified! Taking you to account setup...'
              : 'Your email has been verified.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {isRedirecting && (
            <Icons.spinner className="h-6 w-6 animate-spin" />
          )}
          {error && (
            <>
              <p className="text-sm text-red-500">{error}</p>
              <Button asChild>
                <a href="/onboarding">Continue to Account Setup</a>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
