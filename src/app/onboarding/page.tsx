'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: true,
        callbackUrl: '/'
      })
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    // Check account state
    if (session?.user?.accountState === 'EMAIL_PENDING') {
      router.push('/auth/verify-email')
    }
  }, [status, router, session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user) {
    return null
  }

  // Additional verification check
  if (session.user.accountState === 'EMAIL_PENDING') {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      <OnboardingWizard user={session.user} />
    </div>
  )
}
