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
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const translationPreferencesSchema = z.object({
  showMemory: z.boolean(),
  showGlossary: z.boolean(),
  showQA: z.boolean(),
  autoSave: z.boolean(),
})

type TranslationPreferencesValues = z.infer<typeof translationPreferencesSchema>

interface TranslationPreferencesFormProps {
  userId: string
  defaultValues?: Partial<TranslationPreferencesValues>
}

export function TranslationPreferencesForm({
  userId,
  defaultValues,
}: TranslationPreferencesFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("settings.translation.form")

  const form = useForm<TranslationPreferencesValues>({
    resolver: zodResolver(translationPreferencesSchema),
    defaultValues: {
      showMemory: true,
      showGlossary: true,
      showQA: true,
      autoSave: true,
      ...defaultValues,
    },
  })

  async function onSubmit(data: TranslationPreferencesValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/settings/translation-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
      })

      if (!response.ok) throw new Error("Failed to update translation preferences")

      toast.success("Translation preferences updated successfully")
    } catch (error) {
      toast.error("Failed to update translation preferences")
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="showMemory"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("showMemory")}</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showGlossary"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("showGlossary")}</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showQA"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("showQA")}</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autoSave"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("autoSave")}</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
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
