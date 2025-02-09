"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  period: "daily" | "weekly" | "monthly"
  streak: number
}

interface PracticeGoalsProps {
  className?: string
  userId: string
}

export function PracticeGoals({ className, userId }: PracticeGoalsProps) {
  // This would typically be fetched from an API
  const goals: Goal[] = [
    {
      id: "1",
      title: "Practice Time",
      target: 30,
      current: 20,
      unit: "minutes",
      period: "daily",
      streak: 5,
    },
    {
      id: "2",
      title: "Exercises Completed",
      target: 15,
      current: 12,
      unit: "exercises",
      period: "weekly",
      streak: 3,
    },
    {
      id: "3",
      title: "Words Learned",
      target: 100,
      current: 65,
      unit: "words",
      period: "monthly",
      streak: 2,
    },
  ]

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Practice Goals</CardTitle>
        <Button variant="outline" size="sm">
          <Icons.settings className="mr-2 h-4 w-4" />
          Adjust Goals
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{goal.title}</span>
                      {goal.streak > 0 && (
                        <div className="flex items-center space-x-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-500">
                          <Icons.flame className="h-3 w-3" />
                          <span>{goal.streak} day streak</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {goal.current} of {goal.target} {goal.unit} ({goal.period})
                    </div>
                  </div>
                  <div className="text-sm font-medium">{Math.round(progress)}%</div>
                </div>
                <Progress value={progress} />
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-lg border bg-muted p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Daily Streak</div>
              <div className="flex items-center space-x-1 text-orange-500">
                <Icons.flame className="h-4 w-4" />
                <span className="text-2xl font-bold">5</span>
                <span className="text-sm">days</span>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              View History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
