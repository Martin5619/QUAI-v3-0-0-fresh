"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { AvatarUpload } from "@/components/ui/avatar-upload"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  title: z.string().optional(),
  organization: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().optional(),
  primaryLanguage: z.string(),
  secondaryLanguages: z.array(z.string()).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileStepProps {
  userId: string
  onNext: (data: ProfileFormValues) => void
}

export function ProfileStep({ userId, onNext }: ProfileStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      title: "",
      organization: "",
      bio: "",
      avatar: "",
      primaryLanguage: "en",
      secondaryLanguages: [],
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      onNext(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Personalize Your Experience</h1>
        <p className="text-muted-foreground">
          Help us tailor QUAi to your needs. You can always update these details later.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <AvatarUpload
                    value={field.value}
                    onChange={field.onChange}
                    userId={userId}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Add a profile picture to make your account more personal
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="How should we call you?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your role or profession" {...field} />
                </FormControl>
                <FormDescription>
                  This helps us suggest relevant content
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Where do you work or study?" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About You (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What are your interests or learning goals?"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This helps us personalize your learning experience
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
