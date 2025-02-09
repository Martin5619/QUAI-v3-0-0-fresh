"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      console.log("Submitting registration:", { email, password: "***" })

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Registration response status:", res.status)
      const data = await res.json()
      console.log("Registration response data:", data)
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to register")
      }

      console.log("Registration successful, attempting sign in")
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      router.push("/onboarding")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-8 w-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">Q</div>
          QUAi
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "QUAi helps me practice and improve my language skills with AI-generated
              questions tailored to my learning needs."
            </p>
            <footer className="text-sm">James Wilson, Language Learner</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button disabled={loading}>
                {loading ? "Creating account..." : "Sign up with Email"}
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
            disabled={loading}
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
          >
            Sign up with Google
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
