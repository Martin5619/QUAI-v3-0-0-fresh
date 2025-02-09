"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { locales, localeConfig } from "@/i18n.config"

const accountFormSchema = z.object({
  language: z.string(),
  timezone: z.string(),
  theme: z.enum(["light", "dark", "system"]),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface AccountFormProps {
  userId: string
  defaultValues: Partial<AccountFormValues>
}

export function AccountForm({ userId, defaultValues }: AccountFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("settings.account.form")

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      theme: "system",
      ...defaultValues,
    },
  })

  async function onSubmit(data: AccountFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/settings/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
      })

      if (!response.ok) throw new Error("Failed to update account settings")

      toast.success("Account settings updated successfully")
    } catch (error) {
      toast.error("Failed to update account settings")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("language")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {localeConfig[locale].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("timezone")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Intl.supportedValuesOf("timeZone").map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("theme.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">{t("theme.light")}</SelectItem>
                      <SelectItem value="dark">{t("theme.dark")}</SelectItem>
                      <SelectItem value="system">{t("theme.system")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("save")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
