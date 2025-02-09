'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { FileText, Settings2, ArrowRight } from 'lucide-react'
import { LoadingState } from '@/components/ui/loading'

interface Generation {
  id: string
  title: string
  customPrompt?: string
  questionTypes: string[]
  difficulty: string
  numberOfQuestions: number
  createdAt: string
  documents: Array<{
    id: string
    title: string
    fileName: string
  }>
}

export function GenerationHistory() {
  const router = useRouter()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const response = await fetch('/api/generations')
        if (!response.ok) {
          throw new Error('Failed to fetch generations')
        }
        const data = await response.json()
        setGenerations(data)
      } catch (error) {
        console.error('Error fetching generations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenerations()
  }, [])

  if (loading) {
    return <LoadingState />
  }

  const handleUseTemplate = (generation: Generation) => {
    const params = new URLSearchParams({
      template: generation.id,
      ...(generation.documents[0] && { documentId: generation.documents[0].id })
    })
    router.push(`/questions/generate?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {generations.map((generation) => (
        <Card key={generation.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{generation.title}</h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Settings2 className="h-4 w-4" />
                <span>{generation.numberOfQuestions} questions</span>
                <span>•</span>
                <span>{generation.difficulty}</span>
                <span>•</span>
                <span>{generation.questionTypes.join(', ')}</span>
              </div>

              {generation.documents.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  {generation.documents.map(doc => doc.title).join(', ')}
                </div>
              )}

              <div className="text-sm text-gray-500">
                Created {format(new Date(generation.createdAt), 'MMM d, yyyy h:mm a')}
              </div>

              {generation.customPrompt && (
                <div className="mt-4">
                  <Badge variant="secondary">Custom Prompt</Badge>
                  <p className="mt-2 text-sm text-gray-600">{generation.customPrompt}</p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => handleUseTemplate(generation)}
            >
              Use Template
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}

      {generations.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No generations found</p>
        </Card>
      )}
    </div>
  )
}
