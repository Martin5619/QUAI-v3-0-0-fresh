"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EntityIcons, EntityColors } from "@/components/icons/entity-icons"

interface RecentQuestionsProps {
  className?: string
  userId: string
}

export function RecentQuestions({ className, userId }: RecentQuestionsProps) {
  return (
    <Card className={`p-6 h-[400px] flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <EntityIcons.Question className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Recent Questions</h2>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ask
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-2">
          {/* Placeholder for empty state */}
          <div className="text-center py-8">
            <EntityIcons.Question className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No questions yet. Start asking to learn more!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button variant="link" className="p-0 h-auto text-sm">
          View all questions →
        </Button>
      </div>
    </Card>
  )
}
