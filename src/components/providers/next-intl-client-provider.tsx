"use client"

import { NextIntlClientProvider as Provider } from "next-intl"
import { useMessages } from "next-intl"

interface NextIntlClientProviderProps {
  children: React.ReactNode
}

export function NextIntlClientProvider({
  children,
}: NextIntlClientProviderProps) {
  const messages = useMessages()

  return <Provider messages={messages}>{children}</Provider>
}
