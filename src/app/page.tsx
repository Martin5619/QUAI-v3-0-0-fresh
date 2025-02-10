import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LandingPage } from '@/components/landing/LandingPage'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'

export default async function Home() {
  try {
    const session = await auth()

    if (session?.user) {
      if (!session.user.onboarded) {
        redirect('/onboarding')
      } else {
        redirect('/dashboard')
      }
    }

    return (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    )
  } catch (error) {
    if ((error as any)?.message === 'NEXT_REDIRECT') {
      throw error // Let Next.js handle the redirect
    }
    
    console.error("[HOME_PAGE_ERROR]", error)
    return (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    )
  }
}
