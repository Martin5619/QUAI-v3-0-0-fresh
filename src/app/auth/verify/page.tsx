'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setError('No verification token provided')
        return
      }

      try {
        const response = await fetch('/api/auth/verify_v3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Verification failed')
        }

        const { email } = await response.json()
        setStatus('success')
        
        // Store email in sessionStorage for verification success page
        sessionStorage.setItem('verifiedEmail', email)
        router.push('/auth/verification-success')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Verification failed')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'loading' && <Icons.spinner className="h-6 w-6 animate-spin" />}
            {status === 'success' && <Icons.check className="h-6 w-6 text-green-500" />}
            {status === 'error' && <Icons.warning className="h-6 w-6 text-red-500" />}
            Email Verification
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email verified successfully! Taking you to account setup...'}
            {status === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'error' && (
            <div className="text-center">
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button onClick={() => router.push('/signin')}>
                Back to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
