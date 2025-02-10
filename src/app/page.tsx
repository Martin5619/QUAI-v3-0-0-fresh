import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LandingPage } from '@/components/landing/LandingPage'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <ErrorBoundary>
      <LandingPage />
    </ErrorBoundary>
  )
}
