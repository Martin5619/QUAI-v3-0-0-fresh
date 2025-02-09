"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface LearningProgress {
  topic: string
  progress: number
  totalExercises: number
  completedExercises: number
  lastAccessed?: string
}

interface LearningProgressProps {
  className?: string
  userId: string
}

export function LearningProgress({ className, userId }: LearningProgressProps) {
  // This would typically be fetched from an API
  const learningProgress: LearningProgress[] = [
    {
      topic: "Grammar Fundamentals",
      progress: 75,
      totalExercises: 20,
      completedExercises: 15,
      lastAccessed: "2024-02-08",
    },
    {
      topic: "Vocabulary Building",
      progress: 45,
      totalExercises: 30,
      completedExercises: 14,
      lastAccessed: "2024-02-07",
    },
    {
      topic: "Writing Skills",
      progress: 60,
      totalExercises: 25,
      completedExercises: 15,
      lastAccessed: "2024-02-06",
    },
  ]

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {learningProgress.map((topic) => (
            <div key={topic.topic} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{topic.topic}</span>
                    {topic.lastAccessed && (
                      <span className="text-sm text-muted-foreground">
                        Last studied {new Date(topic.lastAccessed).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {topic.completedExercises} of {topic.totalExercises} exercises completed
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{topic.progress}%</span>
                  {topic.progress === 100 ? (
                    <Icons.checkCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Icons.circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <Progress value={topic.progress} />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border bg-muted p-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Icons.trendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Overall Progress</div>
              <div className="text-2xl font-bold">60%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
