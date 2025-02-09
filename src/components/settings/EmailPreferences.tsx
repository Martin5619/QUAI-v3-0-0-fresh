'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EmailPreference {
  key: string
  label: string
  description: string
}

const EMAIL_PREFERENCES: EmailPreference[] = [
  {
    key: 'performance',
    label: 'Performance Updates',
    description: 'Get notified about your quiz performance and progress.'
  },
  {
    key: 'newFeatures',
    label: 'New Features',
    description: 'Stay updated with new features and improvements.'
  },
  {
    key: 'tips',
    label: 'Study Tips & Recommendations',
    description: 'Receive personalized study tips and content recommendations.'
  },
  {
    key: 'marketing',
    label: 'Marketing Communications',
    description: 'Receive updates about new products, features, and special offers.'
  }
]

export function EmailPreferences() {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    performance: true,
    newFeatures: true,
    tips: true,
    marketing: false
  })

  const handleToggle = async (key: string) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/user/email-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: newPreferences }),
      })

      if (!response.ok) {
        throw new Error('Failed to update email preferences')
      }

      setPreferences(newPreferences)
      toast.success('Email preferences updated')
    } catch (error) {
      toast.error('Failed to update email preferences')
      // Revert the change
      setPreferences(preferences)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {EMAIL_PREFERENCES.map((pref) => (
        <div key={pref.key} className="flex items-start space-x-4">
          <Switch
            id={pref.key}
            checked={preferences[pref.key]}
            onCheckedChange={() => handleToggle(pref.key)}
            disabled={loading}
          />
          <div className="space-y-1">
            <Label
              htmlFor={pref.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {pref.label}
            </Label>
            <p className="text-sm text-gray-500">{pref.description}</p>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex items-center text-sm text-gray-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating preferences...
        </div>
      )}
    </div>
  )
}
