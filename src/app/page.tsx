import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { LandingPage } from '@/components/landing/LandingPage'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'

export default async function Home() {
  try {
    const session = await getServerSession()

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
    console.error("[HOME_PAGE_ERROR]", error)
    return (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    )
  }
}
