import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface GenerationProgressProps {
  progress: number
  status: 'idle' | 'generating' | 'error' | 'complete' | 'canceled'
  error?: string
  retryAttempt?: number
  onCancel?: () => void
  onRetry?: () => void
  questionSetId?: string
}

const ERROR_SUGGESTIONS = {
  'rate limit': [
    'Wait a few minutes before trying again',
    'Reduce the number of questions'
  ],
  'context length': [
    'Reduce the amount of document content',
    'Generate fewer questions at once',
    'Split your request into smaller batches'
  ],
  'api key': [
    'Check your API key configuration',
    'Contact support if the issue persists'
  ],
  'timeout': [
    'Try generating fewer questions',
    'Check your internet connection',
    'Try again in a few minutes'
  ],
  'default': [
    'Try again with fewer questions',
    'Check your inputs and try again',
    'Contact support if the issue persists'
  ]
}

function getSuggestions(error?: string): string[] {
  if (!error) return ERROR_SUGGESTIONS.default

  const errorLower = error.toLowerCase()
  const matchingKey = Object.keys(ERROR_SUGGESTIONS).find(key => 
    errorLower.includes(key)
  )

  return ERROR_SUGGESTIONS[matchingKey as keyof typeof ERROR_SUGGESTIONS] || 
         ERROR_SUGGESTIONS.default
}

export function GenerationProgress({
  progress,
  status,
  error,
  retryAttempt,
  onCancel,
  onRetry,
  questionSetId
}: GenerationProgressProps) {
  const suggestions = getSuggestions(error)

  if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-4">
            <p className="font-medium">{error || 'An error occurred while generating questions'}</p>
            
            <div className="space-y-2">
              <p className="font-medium">Suggestions:</p>
              <ul className="list-disc pl-4 space-y-1">
                {suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              {onRetry && (
                <Button onClick={onRetry} variant="secondary">
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === 'generating' && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {status === 'canceled' && (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium">
              {status === 'idle' && 'Ready to generate'}
              {status === 'generating' && 'Generating questions...'}
              {status === 'canceled' && 'Generation canceled'}
              {status === 'complete' && 'Generation complete!'}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {progress.toFixed(0)}%
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        {status === 'generating' && (
          <div className="flex justify-between items-center">
            {retryAttempt && (
              <p className="text-sm text-muted-foreground">
                Retry attempt {retryAttempt}...
              </p>
            )}
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
