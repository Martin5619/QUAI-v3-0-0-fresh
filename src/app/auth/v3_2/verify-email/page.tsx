"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Icons } from "@/components/ui/icons"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const signInWithStoredCredentials = async () => {
      try {
        const storedData = sessionStorage.getItem('pendingSignup')
        if (!storedData) {
          throw new Error("No pending registration found")
        }

        const { email, password } = JSON.parse(storedData)
        
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false
        })

        if (!result?.ok) {
          throw new Error(result?.error || "Failed to sign in")
        }

        sessionStorage.removeItem('pendingSignup')
        router.push("/onboarding/v3_2")
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        setIsLoading(false)
      }
    }

    signInWithStoredCredentials()
  }, [router])

  if (error) {
    return (
      <div className="container flex h-screen w-full flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-4">
            <Icons.warning className="h-8 w-8 text-red-500" />
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Registration Failed
              </h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={() => router.push("/auth/v3_2/signin")}
                className="text-primary hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Completing registration...
          </p>
        </div>
      </div>
    </div>
  )
}
