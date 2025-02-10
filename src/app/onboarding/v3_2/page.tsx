"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/v3_2/signin")
      return
    }

    // Check onboarding state
    const onboarding = session.user.onboarding
    if (!onboarding) {
      console.error("No onboarding state found")
      return
    }

    // Redirect to appropriate step
    if (onboarding.isComplete) {
      router.push("/dashboard")
    } else {
      router.push(`/onboarding/v3_2/step/${onboarding.currentStep}`)
    }

    setIsLoading(false)
  }, [session, status, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to QUAi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={0} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Let&apos;s get your account set up...
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/onboarding/v3_2/step/1")}
          >
            Start Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
