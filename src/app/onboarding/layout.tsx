"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return null
  }

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container relative flex min-h-screen flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
