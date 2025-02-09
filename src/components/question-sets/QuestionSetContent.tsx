'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionSet_v2414, Question_v2414 } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface QuestionSetContentProps {
  questionSet: QuestionSet_v2414 & {
    questions: Question_v2414[]
    documents: Array<{
      document: {
        id: string
        title: string | null
        fileName: string
      }
    }>
  }
}

export function QuestionSetContent({ questionSet }: QuestionSetContentProps) {
  const router = useRouter()
  const [currentQuestionSet, setCurrentQuestionSet] = useState(questionSet)
  const [loading, setLoading] = useState(currentQuestionSet.status_v2414 === 'pending')

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (currentQuestionSet.status_v2414 === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/question-sets_v2414/${currentQuestionSet.id}`)
          if (response.ok) {
            const data = await response.json()
            setCurrentQuestionSet(data)
            if (data.status_v2414 !== 'pending') {
              setLoading(false)
            }
          }
        } catch (error) {
          console.error('Error fetching question set:', error)
        }
      }, 2000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [currentQuestionSet.id, currentQuestionSet.status_v2414])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg">Generating questions...</p>
        <p className="text-sm text-gray-500">This may take a few moments</p>
      </div>
    )
  }

  if (currentQuestionSet.status_v2414 === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-red-500">Failed to generate questions</p>
        <Button onClick={() => router.push('/documents')}>
          Return to Documents
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Question Set #{currentQuestionSet.displayNumber}</h1>
        <div className="flex gap-2 mb-4">
          {currentQuestionSet.documents.map(({ document }) => (
            <Badge key={document.id} variant="secondary">
              {document.title || document.fileName}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Badge>{currentQuestionSet.difficulty}</Badge>
          <Badge>{currentQuestionSet.numberOfQuestions} questions</Badge>
          {currentQuestionSet.questionTypes.map((type: string) => (
            <Badge key={type} variant="outline">
              {type.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {currentQuestionSet.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {index + 1}
              </CardTitle>
              <CardDescription>
                Type: {question.type.replace('_', ' ')} • Difficulty: {question.difficulty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">{question.question}</p>
                {question.type === 'multiple_choice' && (
                  <div className="grid gap-2">
                    {question.options.map((option: string, optionIndex: number) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          option === question.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {option}
                        {option === question.correctAnswer && (
                          <span className="text-green-600 ml-2">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'true_false' && (
                  <div className="grid gap-2">
                    {['True', 'False'].map((option) => (
                      <div
                        key={option}
                        className={`p-3 rounded-lg border ${
                          option === question.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {option}
                        {option === question.correctAnswer && (
                          <span className="text-green-600 ml-2">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {question.explanation && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">Explanation:</p>
                  <p className="text-gray-600">{question.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => router.push('/documents')}>
          Back to Documents
        </Button>
      </div>
    </div>
  )
}
