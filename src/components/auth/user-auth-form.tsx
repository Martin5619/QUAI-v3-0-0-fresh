'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'
import HCaptcha from '@hcaptcha/react-hcaptcha'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: 'signin' | 'signup'
}

export function UserAuthForm({ className, mode = 'signin', ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(mode === 'signin' ? loginSchema : registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
      recaptchaToken: '',
    },
  })

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const captchaRef = React.useRef<HCaptcha>(null)

  const onCaptchaVerify = (token: string) => {
    setValue('recaptchaToken', token)
  }

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        // Register new user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email.toLowerCase(),
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            confirmPassword: data.confirmPassword,
            recaptchaToken: data.recaptchaToken || '',
          }),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create account')
        }

        if (!responseData?.success) {
          throw new Error('Failed to create account: Invalid response')
        }

        // Store credentials for auto-signin after email verification
        sessionStorage.setItem(
          'pendingSignup',
          JSON.stringify({
            email: data.email.toLowerCase(),
            password: data.password,
          })
        )

        router.push('/auth/verify-email')
      } else {
        // Regular sign in
        const signInResult = await signIn('credentials', {
          email: data.email.toLowerCase(),
          password: data.password,
          redirect: false,
          callbackUrl: searchParams?.get('from') || '/dashboard',
        })

        if (signInResult?.error) {
          throw new Error('Invalid credentials')
        }

        router.push(signInResult?.url || '/dashboard')
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast({
        title: 'Something went wrong',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
      // Reset captcha on error
      captchaRef.current?.resetCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {mode === 'signup' && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="firstName">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  autoCorrect="off"
                  disabled={isLoading || isGoogleLoading}
                  {...register('firstName')}
                />
                {errors?.firstName && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="lastName">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  autoCorrect="off"
                  disabled={isLoading || isGoogleLoading}
                  {...register('lastName')}
                />
                {errors?.lastName && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          {mode === 'signup' && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading || isGoogleLoading}
                  {...register('confirmPassword')}
                />
                {errors?.confirmPassword && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {process.env.NODE_ENV !== 'development' && (
                <>
                  <div className="flex justify-center py-2">
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
                      onVerify={onCaptchaVerify}
                    />
                  </div>
                  {errors?.recaptchaToken && (
                    <p className="px-1 text-xs text-red-600 text-center">
                      {errors.recaptchaToken.message}
                    </p>
                  )}
                </>
              )}
            </>
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || isGoogleLoading}
        onClick={() => {
          setIsGoogleLoading(true)
          signIn('google', {
            callbackUrl: searchParams?.get('from') || '/dashboard',
          })
        }}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  )
}
