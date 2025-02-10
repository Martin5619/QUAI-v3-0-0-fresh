'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/ui/avatar-upload"

interface ProfileStepProps {
  initialData: {
    name: string
    avatar: string
  }
  onNext: (data: any) => void
  onBack: () => void
}

export function ProfileStep({ initialData, onNext, onBack }: ProfileStepProps) {
  const [name, setName] = useState(initialData.name)
  const [avatar, setAvatar] = useState(initialData.avatar)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ name, avatar })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Tell us a bit about yourself
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="avatar">Profile Picture</Label>
          <AvatarUpload
            value={avatar}
            onChange={setAvatar}
            className="mx-auto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  )
}
