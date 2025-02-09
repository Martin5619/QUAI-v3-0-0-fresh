import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserAuthForm } from '@/components/auth/user-auth-form'
import AuthLayout from '@/components/auth/AuthLayout'

export const metadata: Metadata = {
  title: 'Sign In - QUAi',
  description: 'Sign in to your QUAi account',
}

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/signup"
          className="hover:text-brand underline underline-offset-4"
        >
          Don&apos;t have an account? Sign Up
        </Link>
      </p>
    </AuthLayout>
  )
}
