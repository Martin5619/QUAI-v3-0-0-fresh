'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  ExternalLink,
  Loader2,
  BookOpen,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface QuestionSet {
  id: string
  title: string
  displayNumber: number
  status_v2414: string
  error_v2414?: string
  document: {
    id: string
    title: string
  }
  questions_v2414: Array<{
    id: string
    content: string
    answer: string
  }>
  createdAt: string
  updatedAt: string
}

export function QuestionList() {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const fetchQuestionSets = async () => {
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/questions_v2414/sets?_=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to fetch question sets')
        }
        const data = await response.json()
        console.log('QuestionList - Fetched data:', data)
        setQuestionSets(data)

        // Check if any question sets are still processing
        const hasProcessing = data.some((set: QuestionSet) => 
          set.status_v2414 === 'pending' || set.status_v2414 === 'processing'
        )

        // If there are processing sets, poll every 5 seconds
        if (hasProcessing) {
          timeoutId = setTimeout(fetchQuestionSets, 5000)
        }
      } catch (error) {
        console.error('Error fetching question sets:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to load question sets')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestionSets()

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (questionSets.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No question sets</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by generating questions from your documents
          </p>
          <div className="mt-6">
            <Link href="/questions/generate">
              <Button>
                Generate Questions
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Question Sets</h2>
        <Link href="/questions/generate">
          <Button>Generate New Questions</Button>
        </Link>
      </div>

      {/* Question Sets Container */}
      <div className="w-full">
        {questionSets.map((set) => (
          <div 
            key={set.id} 
            className="mb-4 last:mb-0 bg-white rounded-lg border shadow-sm overflow-hidden relative"
          >
            {/* Question Number Badge */}
            <div className="absolute -left-2 -top-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md flex items-center justify-center text-white font-medium text-sm">
              {set.displayNumber}
            </div>

            {/* Question Set Header */}
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {/* Title and Status */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium">
                        {set.title || `Question Set ${set.displayNumber}`}
                      </h3>
                      <Badge variant={
                        set.status_v2414 === 'completed' ? 'success' : 
                        set.status_v2414 === 'error' ? 'destructive' : 
                        'secondary'
                      }>
                        {set.status_v2414 === 'completed' ? 'Ready' : 
                         set.status_v2414 === 'error' ? 'Failed' :
                         'Processing'}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {set.status_v2414 === 'completed' ? (
                      <Link href={`/questions/${set.id}`}>
                        <Button variant="outline" size="sm">
                          View Questions
                        </Button>
                      </Link>
                    ) : set.status_v2414 === 'error' ? (
                      <div className="flex flex-col items-end gap-2">
                        <Button variant="outline" size="sm" className="text-red-500" disabled>
                          Generation Failed
                        </Button>
                        <p className="text-xs text-gray-500">
                          Please try generating again
                        </p>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </Button>
                    )}
                  </div>
                </div>

                {/* Question Set Details */}
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <p>{set.questions_v2414.length} questions</p>
                  <p>Created on {new Date(set.createdAt).toLocaleString()}</p>
                </div>

                {/* Source Document */}
                {set.document && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Source document:</p>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{set.document.title}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
