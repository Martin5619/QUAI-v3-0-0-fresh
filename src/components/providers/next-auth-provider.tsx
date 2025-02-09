"use client"

import { SessionProvider } from "next-auth/react"

export function NextAuthProvider_v2414({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
