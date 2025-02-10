"use client"

import { Card } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

interface RecentQuestionsProps {
  userId: string
}

export function RecentQuestions({ userId }: RecentQuestionsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Questions</h2>
      <div className="text-center py-6">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No questions yet</h3>
        <p className="text-sm text-muted-foreground">
          Your recent questions will appear here
        </p>
      </div>
    </Card>
  )
}
