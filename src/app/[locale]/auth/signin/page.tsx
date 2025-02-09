import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Sign In | QUAi",
  description: "Sign in to your QUAi account",
}

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  const t = useTranslations("auth")

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/logo.png"
            alt="QUAi Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          QUAi
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {t("testimonial")}
            </p>
            <footer className="text-sm">{t("testimonialAuthor")}</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("welcomeMessage")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("signInPrompt")}
            </p>
          </div>
          <div className="grid gap-6">
            <form>
              <div className="grid gap-4">
                <Link
                  href="/api/auth/signin/google"
                  className={Button({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  <Icons.google className="mr-2 h-4 w-4" />
                  {t("signInWithGoogle")}
                </Link>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("or")}
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <p className="px-8 text-center text-sm text-muted-foreground">
                {t("termsMessage")}{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {t("termsOfService")}
                </Link>{" "}
                {t("and")}{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {t("privacyPolicy")}
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
