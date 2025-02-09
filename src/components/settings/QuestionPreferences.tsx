'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { User_v2414 } from '@prisma/client'

interface QuestionPreferences {
  defaultQuestionTypes: string[]
  defaultDifficulty: string
  autoGenerate: boolean
  numQuestionsPerSet: number
  includeExplanations: boolean
}

const DEFAULT_PREFERENCES: QuestionPreferences = {
  defaultQuestionTypes: ['multiple_choice'],
  defaultDifficulty: 'medium',
  autoGenerate: false,
  numQuestionsPerSet: 5,
  includeExplanations: true
}

export function QuestionPreferences() {
  const [preferences, setPreferences] = useState<QuestionPreferences>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user_v2414/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'question_generation',
          preferences
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      toast.success('Question preferences saved')
    } catch (error) {
      toast.error('Failed to save preferences')
      console.error('Error saving preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Question Generation Preferences</h3>
      
      <div className="space-y-6">
        <div>
          <Label>Default Question Types</Label>
          <Select
            value={preferences.defaultDifficulty}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, defaultDifficulty: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Number of Questions per Set</Label>
          <Select
            value={preferences.numQuestionsPerSet.toString()}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, numQuestionsPerSet: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Questions</SelectItem>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
              <SelectItem value="15">15 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-Generate Questions</Label>
            <p className="text-sm text-gray-500">Automatically generate questions when uploading documents</p>
          </div>
          <Switch
            checked={preferences.autoGenerate}
            onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoGenerate: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Include Explanations</Label>
            <p className="text-sm text-gray-500">Include detailed explanations with each answer</p>
          </div>
          <Switch
            checked={preferences.includeExplanations}
            onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, includeExplanations: checked }))}
          />
        </div>

        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </Card>
  )
}
