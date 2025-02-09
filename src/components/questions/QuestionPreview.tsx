'use client'

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface QuestionPreviewProps {
  question: {
    id: string
    content: string
    options: string[]
    correctAnswer: string
    explanation?: string
  }
  currentIndex: number
  totalQuestions: number
  questionId: string
  selectedAnswer?: number
  onAnswerSelect: (questionId: string, answer: number) => void
  showAnswer: boolean
}

export function QuestionPreview({
  question,
  currentIndex,
  totalQuestions,
  questionId,
  selectedAnswer,
  onAnswerSelect,
  showAnswer
}: QuestionPreviewProps) {
  // Find the index of the correct answer by matching the text
  const correctAnswerIndex = question.options.findIndex(
    option => option === question.correctAnswer
  )

  console.log('QuestionPreview render:', {
    questionId,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    correctAnswerIndex,
    options: question.options,
    showAnswer
  })

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div className="mt-4 text-lg font-medium leading-6">
            {question.content}
          </div>
        </div>

        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => onAnswerSelect(questionId, parseInt(value))}
          className="space-y-3"
          disabled={showAnswer}
        >
          {question.options.map((option, index) => {
            const isCorrect = index === correctAnswerIndex
            const isIncorrect = selectedAnswer === index && !isCorrect

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                  {
                    "border-green-500 bg-green-50": showAnswer && isCorrect,
                    "border-red-500 bg-red-50": showAnswer && isIncorrect,
                    "border-gray-200 hover:border-primary": !showAnswer,
                    "border-primary bg-primary/5": selectedAnswer === index && !showAnswer,
                  }
                )}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`${questionId}-${index}`}
                  disabled={showAnswer}
                />
                <Label
                  htmlFor={`${questionId}-${index}`}
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
                {showAnswer && (
                  <>
                    {isCorrect && (
                      <span className="text-green-600">✓</span>
                    )}
                    {isIncorrect && (
                      <span className="text-red-600">✗</span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </RadioGroup>

        {showAnswer && question.explanation && (
          <div className="mt-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="font-medium">Explanation</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {question.explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
