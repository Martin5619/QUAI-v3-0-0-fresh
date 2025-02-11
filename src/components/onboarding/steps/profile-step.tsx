'use client'

import React from "react"
import { useSession } from "next-auth/react"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface ProfileStepProps {
  data: {
    firstName?: string
    lastName?: string
    avatar?: string
    bio?: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  isLoading?: boolean
}

export function ProfileStep({ data, onUpdate, onNext, isLoading }: ProfileStepProps) {
  const { data: session } = useSession()
  console.log("[PROFILE_STEP] Session data:", session)

  // Initialize state from props first, then session if available
  const [firstName, setFirstName] = React.useState(data.firstName || session?.user?.firstName || "")
  const [lastName, setLastName] = React.useState(data.lastName || session?.user?.lastName || "")

  React.useEffect(() => {
    console.log("[PROFILE_STEP] Current data:", data)
    console.log("[PROFILE_STEP] Session user:", session?.user)

    // Update form data with session data if available and fields are empty
    if (session?.user?.firstName && session?.user?.lastName && !data.firstName && !data.lastName) {
      console.log("[PROFILE_STEP] Updating from session:", {
        firstName: session.user.firstName,
        lastName: session.user.lastName
      })
      onUpdate({
        firstName: session.user.firstName,
        lastName: session.user.lastName
      })
    }
  }, [session?.user, data, onUpdate])

  // Handle input changes
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstName(value)
    onUpdate({ ...data, firstName: value })
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastName(value)
    onUpdate({ ...data, lastName: value })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-gray-600">Tell us a bit about yourself</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              placeholder="First name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              placeholder="Last name"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Picture</label>
          <AvatarUpload
            value={data.avatar || ""}
            onChange={(value) => onUpdate({ ...data, avatar: value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <Textarea
            id="bio"
            value={data.bio || ""}
            onChange={(e) => onUpdate({ ...data, bio: e.target.value })}
            placeholder="Tell us about yourself"
            className="w-full h-32"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={isLoading}>
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
