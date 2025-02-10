'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"

interface PreferencesStepProps {
  data: any
  onUpdate: (data: any) => void
  onBack: () => void
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

export function PreferencesStep({ data, onUpdate, onBack }: PreferencesStepProps) {
  const [preferences, setPreferences] = useState({
    theme: data.preferences?.theme || 'system',
    notifications: data.preferences?.notifications || 'important',
    language: data.preferences?.language || 'en'
  })

  const handleUpdate = (key: string, value: string) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Your Preferences</h1>
        <p className="text-muted-foreground">
          Customize your QUAi experience
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Theme Preference</Label>
          <RadioGroup 
            value={preferences.theme} 
            onValueChange={(value) => handleUpdate('theme', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Notification Preferences</Label>
          <RadioGroup 
            value={preferences.notifications} 
            onValueChange={(value) => handleUpdate('notifications', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="important" id="important" />
              <Label htmlFor="important">Important Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">None</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Language</Label>
          <RadioGroup 
            value={preferences.language} 
            onValueChange={(value) => handleUpdate('language', value)}
            className="grid grid-cols-2 gap-4"
          >
            {languages.map((lang) => (
              <div key={lang.value} className="flex items-center space-x-2">
                <RadioGroupItem value={lang.value} id={`lang-${lang.value}`} />
                <Label htmlFor={`lang-${lang.value}`}>{lang.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => onUpdate({ preferences })}>
          Continue
        </Button>
      </div>
    </div>
  )
}
