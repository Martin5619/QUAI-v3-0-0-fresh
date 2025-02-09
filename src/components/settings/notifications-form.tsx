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
import { Separator } from "@/components/ui/separator"

const notificationsFormSchema = z.object({
  email: z.object({
    taskAssigned: z.boolean(),
    taskReviewed: z.boolean(),
    projectUpdates: z.boolean(),
    teamMessages: z.boolean(),
  }),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

interface NotificationsFormProps {
  userId: string
  defaultValues?: Partial<NotificationsFormValues>
}

export function NotificationsForm({
  userId,
  defaultValues,
}: NotificationsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("settings.notifications.form")

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      email: {
        taskAssigned: true,
        taskReviewed: true,
        projectUpdates: true,
        teamMessages: true,
        ...defaultValues?.email,
      },
    },
  })

  async function onSubmit(data: NotificationsFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
      })

      if (!response.ok) throw new Error("Failed to update notification settings")

      toast.success("Notification settings updated successfully")
    } catch (error) {
      toast.error("Failed to update notification settings")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("email.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email.taskAssigned"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("email.taskAssigned")}</FormLabel>
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
                name="email.taskReviewed"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("email.taskReviewed")}</FormLabel>
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
                name="email.projectUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("email.projectUpdates")}</FormLabel>
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
                name="email.teamMessages"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t("email.teamMessages")}</FormLabel>
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
