'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { Loader2, Upload, FileText } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { MultiSelectCombobox } from '@/components/ui/combobox'
import { Document_v2414 } from '@prisma/client'

interface Document {
  id: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  status: string
  createdAt: string
  updatedAt: string
  questionSets: Array<{
    id: string
    displayNumber: number
    createdAt: string
  }>
}

const QUESTION_TYPES = [
  { id: 'multiple-choice', name: 'Multiple Choice' },
  { id: 'true-false', name: 'True/False' },
]

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy' },
  { id: 'medium', name: 'Medium' },
  { id: 'hard', name: 'Hard' },
]

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function QuestionGenerationForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [questionTypes, setQuestionTypes] = useState<string[]>(['multiple-choice'])
  const [difficulty, setDifficulty] = useState('medium')
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)
  const [activeTab, setActiveTab] = useState('existing')

  // Store the return URL in localStorage when navigating to upload
  const handleUploadClick = () => {
    localStorage.setItem('returnTo', '/questions/generate')
    router.push('/documents')
  }

  // Fetch user's documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoadingDocuments(true)
        const response = await fetch('/api/documents_v2414')
        if (!response.ok) throw new Error('Failed to fetch documents')
        const data = await response.json()
        console.log('Documents data:', data)
        setDocuments(data.documents)
      } catch (error) {
        toast.error('Failed to load documents')
        console.error('Error fetching documents:', error)
      } finally {
        setIsLoadingDocuments(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedDocuments.length === 0 && !customPrompt.trim()) {
      toast.error('Please select at least one document or provide custom text')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: selectedDocuments,
          customPrompt,
          questionTypes,
          difficulty,
          numberOfQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      toast.success('Questions generated successfully!')
      // TODO: Handle successful question generation (redirect or display)
    } catch (error) {
      console.error('Error generating questions:', error)
      toast.error('Failed to generate questions')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generate Questions</h2>
          
          {/* Document Selection */}
          <div className="space-y-4">
            <Label>Documents</Label>
            <Tabs defaultValue="existing" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Select Existing
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload New
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing" className="mt-4">
                {isLoadingDocuments ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading documents...</span>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-4">
                    <MultiSelectCombobox
                      options={documents.map(doc => ({
                        value: doc.id,
                        label: doc.title || doc.fileName,
                        description: `${doc.fileType} • ${formatFileSize(doc.fileSize)}`
                      }))}
                      selected={selectedDocuments}
                      onChange={setSelectedDocuments}
                      placeholder="Select documents..."
                      emptyMessage="No documents found."
                    />
                    {selectedDocuments.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-4">No documents available</p>
                    <Button type="button" onClick={handleUploadClick}>
                      Upload Your First Document
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upload" className="mt-4">
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Upload New Document</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a new document to generate questions from
                  </p>
                  <Button type="button" onClick={handleUploadClick}>
                    Go to Upload Page
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Custom Prompt */}
          <div>
            <Label htmlFor="customPrompt">Additional Context or Instructions</Label>
            <Textarea
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add any additional context or specific instructions for question generation..."
              className="mt-1"
            />
          </div>

          {/* Question Types */}
          <div>
            <Label>Question Types</Label>
            <div className="mt-2 space-y-2">
              {QUESTION_TYPES.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={type.id}
                    value={type.id}
                    checked={questionTypes.includes(type.id)}
                    onChange={(e) => {
                      setQuestionTypes(
                        e.target.checked
                          ? [...questionTypes, type.id]
                          : questionTypes.filter((id) => id !== type.id)
                      )
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={type.id}>{type.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2 mb-8">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={difficulty}
              onValueChange={setDifficulty}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Number of Questions</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setNumberOfQuestions(Math.max(1, numberOfQuestions - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={numberOfQuestions}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    if (!isNaN(value) && value >= 1 && value <= 50) {
                      setNumberOfQuestions(value)
                    }
                  }}
                  className="h-8 w-16 text-center"
                  min="1"
                  max="50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setNumberOfQuestions(Math.min(50, numberOfQuestions + 1))}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[numberOfQuestions]}
                onValueChange={(value) => setNumberOfQuestions(value[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || (selectedDocuments.length === 0 && !customPrompt.trim())}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            'Generate Questions'
          )}
        </Button>
      </form>
    </Card>
  )
}
