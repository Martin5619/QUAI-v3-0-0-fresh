'use client'

import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { FileIcon, MessageCircleIcon } from 'lucide-react'

interface UsageProgressProps {
  documentsPercent: number
  questionsPercent: number
  loading?: boolean
}

export default function UsageProgress({ documentsPercent, questionsPercent, loading = false }: UsageProgressProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-24 mb-2"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-24 mb-2"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
          </div>
        </Card>
      </div>
    )
  }

  const clampedDocumentsPercent = Math.min(Math.max(documentsPercent || 0, 0), 100)
  const clampedQuestionsPercent = Math.min(Math.max(questionsPercent || 0, 0), 100)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <FileIcon className="h-6 w-6" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Documents</p>
              <span className="text-sm text-muted-foreground">
                {Math.round(clampedDocumentsPercent)}% used
              </span>
            </div>
            <div className="mt-2">
              <Progress value={clampedDocumentsPercent} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <MessageCircleIcon className="h-6 w-6" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Questions</p>
              <span className="text-sm text-muted-foreground">
                {Math.round(clampedQuestionsPercent)}% used
              </span>
            </div>
            <div className="mt-2">
              <Progress value={clampedQuestionsPercent} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
