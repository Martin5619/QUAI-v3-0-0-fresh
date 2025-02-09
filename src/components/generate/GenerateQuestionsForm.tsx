'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Document_v2414 } from '@prisma/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

interface GenerateQuestionsFormProps {
  documents: Document_v2414[]
  defaultDocumentId?: string
}

export function GenerateQuestionsForm({ documents, defaultDocumentId }: GenerateQuestionsFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [questionTypes, setQuestionTypes] = useState<string[]>(['multiple_choice'])
  const [difficulty, setDifficulty] = useState('medium')
  const [numberOfQuestions, setNumberOfQuestions] = useState('5')
  const [customPrompt, setCustomPrompt] = useState('')
  const [guidance, setGuidance] = useState('')
  const [title, setTitle] = useState('')

  // Load selected document and set default title
  useEffect(() => {
    const documentId = defaultDocumentId || searchParams.get('documentId')
    if (documentId) {
      setSelectedDocuments([documentId])
      const document = documents.find(doc => doc.id === documentId)
      if (document) {
        setTitle(`Questions from ${document.title}`)
      }
    }
  }, [documents, searchParams, defaultDocumentId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Enhanced validation
    if (!title.trim()) {
      setError('Please enter a title for your question set')
      toast.error('Please enter a title for your question set')
      return
    }

    if (selectedDocuments.length === 0 && !customPrompt?.trim()) {
      setError('Please select at least one document or provide custom text')
      toast.error('Please select at least one document or provide custom text')
      return
    }

    if (!questionTypes.length) {
      setError('Please select at least one question type')
      toast.error('Please select at least one question type')
      return
    }

    if (!difficulty) {
      setError('Please select a difficulty level')
      toast.error('Please select a difficulty level')
      return
    }

    const numQuestions = parseInt(numberOfQuestions)
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 20) {
      setError('Please enter a valid number of questions (1-20)')
      toast.error('Please enter a valid number of questions (1-20)')
      return
    }

    setError('')
    setLoading(true)

    try {
      console.log('[Form] Submitting request:', {
        documentIds: selectedDocuments,
        questionTypes,
        difficulty,
        numberOfQuestions: numQuestions,
        customPrompt: customPrompt?.trim(),
        guidance: guidance?.trim(),
        title: title.trim()
      })

      const response = await fetch(`/api/documents_v2414/${selectedDocuments[0]}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentIds: selectedDocuments,
          questionTypes,
          difficulty,
          numberOfQuestions: numQuestions,
          customPrompt: customPrompt?.trim() || undefined,
          guidance: guidance?.trim() || undefined,
          title: title.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('[Form] API error response:', data)
        
        if (data.error === 'You have reached your monthly limit') {
          router.push('/pricing')
          return
        }

        throw new Error(data.error || 'Failed to generate questions')
      }

      const data = await response.json()
      console.log('[Form] Question generation started:', data)
      
      toast.success('Question generation started')
      router.push(`/questions/${data.questionSetId}`)
    } catch (error) {
      console.error('[Form] Error generating questions:', error)
      const message = error instanceof Error ? error.message : 'Failed to generate questions'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Question Set Details */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-900">
            <svg className="mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Question Set Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">Set the title and instructions for your question set</p>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">Question Set Title<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your question set"
              required
            />
          </div>

          <div>
            <Label htmlFor="guidance" className="text-sm font-medium mb-2 block">Instructions for Quiz Takers</Label>
            <p className="text-sm text-gray-500 mb-2">Add any special instructions or guidance for users taking this quiz</p>
            <Textarea
              id="guidance"
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder="Example: 'Pay attention to specific dates and events mentioned in the text'"
              className="h-24"
            />
          </div>
        </div>
      </div>

      {/* Source Information Section */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-900">
            <svg className="mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Source Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">Select documents and/or provide custom text as source material for questions</p>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          {/* Document Selection */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-2">
                <Checkbox
                  id={doc.id}
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDocuments([...selectedDocuments, doc.id])
                    } else {
                      setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id))
                    }
                  }}
                />
                <Label htmlFor={doc.id} className="text-sm">{doc.title}</Label>
              </div>
            ))}
          </div>

          {/* Custom Text */}
          <div>
            <Label htmlFor="customPrompt" className="text-sm font-medium mb-2 block">Custom Text (Optional)</Label>
            <p className="text-sm text-gray-500 mb-2">Add your own text to be used as source material, either alone or combined with selected documents</p>
            <Textarea
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter or paste your own text here"
              className="h-32"
            />
          </div>
        </div>
      </div>

      {/* Generation Options */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-900">
            <svg className="mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Generation Options
          </h2>
          <p className="mt-1 text-sm text-gray-500">Configure how your questions will be generated</p>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          {/* Question Types */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Question Types<span className="text-red-500 ml-1">*</span></Label>
            <div className="space-y-2">
              {[
                { id: 'multiple_choice', label: 'Multiple Choice' },
                { id: 'true_false', label: 'True/False' },
                { id: 'short_answer', label: 'Short Answer' },
                { id: 'essay', label: 'Essay' }
              ].map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={questionTypes.includes(type.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setQuestionTypes([...questionTypes, type.id])
                      } else {
                        setQuestionTypes(questionTypes.filter(t => t !== type.id))
                      }
                    }}
                  />
                  <Label htmlFor={type.id} className="text-sm">{type.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <Label htmlFor="difficulty" className="text-sm font-medium mb-2 block">Difficulty Level<span className="text-red-500 ml-1">*</span></Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
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

          {/* Number of Questions */}
          <div>
            <Label htmlFor="numberOfQuestions" className="text-sm font-medium mb-2 block">Number of Questions<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="numberOfQuestions"
              type="number"
              min="1"
              max="20"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || (selectedDocuments.length === 0 && !customPrompt)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Questions'
          )}
        </Button>
      </div>
    </form>
  )
}
