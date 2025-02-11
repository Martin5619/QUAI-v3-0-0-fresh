'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"

interface PreferencesStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  isLoading?: boolean
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' }
]

export function PreferencesStep({ data, onUpdate, onNext, isLoading }: PreferencesStepProps) {
  const [preferences, setPreferences] = useState({
    theme: data.preferences?.theme || 'light',
    notifications: data.preferences?.notifications || 'important',
    language: data.preferences?.language || 'en'
  })

  const handleUpdate = (key: string, value: string) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    onUpdate({ preferences: newPreferences })
  }

  const handleContinue = async () => {
    // Update preferences in parent before continuing
    onUpdate({ preferences })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Preferences</h2>
        <p className="text-sm text-gray-500">Customize your experience</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={preferences.theme}
            onValueChange={(value) => handleUpdate('theme', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Notifications</Label>
          <Select
            value={preferences.notifications}
            onValueChange={(value) => handleUpdate('notifications', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select notification preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="important">Important Only</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={preferences.language}
            onValueChange={(value) => handleUpdate('language', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Continue
      </Button>
    </div>
  )
}
