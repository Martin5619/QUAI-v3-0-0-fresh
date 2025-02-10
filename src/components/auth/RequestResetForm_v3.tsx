'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type RequestResetValues = z.infer<typeof requestResetSchema>

export function RequestResetForm_v3() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
  })

  async function onSubmit(data: RequestResetValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/request-reset_v3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to request password reset')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <Icons.check className="mx-auto h-8 w-8 text-green-500" />
        <h3 className="mt-2 text-lg font-semibold">Check your email</h3>
        <p className="mt-1 text-sm text-gray-500">
          We've sent you a link to reset your password.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push('/signin')}
        >
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          disabled={isLoading}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        Send Reset Link
      </Button>

      <div className="text-center text-sm">
        Remember your password?{' '}
        <Button variant="link" className="p-0" onClick={() => router.push('/signin')}>
          Sign in
        </Button>
      </div>
    </form>
  )
}
