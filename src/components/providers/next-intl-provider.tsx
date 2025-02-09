"use client"

import { NextIntlClientProvider as Provider } from "next-intl"
import { ReactNode } from "react"

interface NextIntlClientProviderProps {
  locale: string
  messages: Record<string, unknown>
  children: ReactNode
}

export function NextIntlClientProvider({
  locale,
  messages,
  children,
}: NextIntlClientProviderProps) {
  return (
    <Provider locale={locale} messages={messages}>
      {children}
    </Provider>
  )
}
