"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Icons } from "@/components/icons"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const autoSignIn = async () => {
      try {
        // Get stored credentials
        const storedData = sessionStorage.getItem('pendingSignup')
        if (!storedData) {
          setError("No pending registration found")
          setIsLoading(false)
          return
        }

        const { email, password } = JSON.parse(storedData)

        // Attempt to sign in
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false
        })

        // Clear stored credentials
        sessionStorage.removeItem('pendingSignup')

        if (result?.error) {
          throw new Error(result.error)
        }

        // Redirect to onboarding
        router.push("/onboarding/v3_2")
      } catch (err) {
        console.error("Auto sign-in error:", err)
        setError(err instanceof Error ? err.message : "Failed to complete registration")
        setIsLoading(false)
      }
    }

    autoSignIn()
  }, [router])

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
          <Icons.warning className="h-10 w-10 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Verification Failed</h2>
          <p className="mb-4 mt-2 text-muted-foreground">{error}</p>
          <button
            className="text-primary hover:underline"
            onClick={() => router.push("/auth/v3_2/signin")}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        {isLoading ? (
          <>
            <Icons.spinner className="h-10 w-10 animate-spin" />
            <h2 className="mt-4 text-2xl font-bold">Completing Registration</h2>
            <p className="mb-4 mt-2 text-muted-foreground">
              Please wait while we verify your account...
            </p>
          </>
        ) : (
          <>
            <Icons.check className="h-10 w-10 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Email Verified</h2>
            <p className="mb-4 mt-2 text-muted-foreground">
              Your email has been verified. Redirecting to onboarding...
            </p>
          </>
        )}
      </div>
    </div>
  )
}
