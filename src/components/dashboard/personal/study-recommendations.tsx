"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Recommendation {
  id: string
  title: string
  description: string
  type: "exercise" | "resource" | "practice"
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  icon: keyof typeof Icons
}

interface StudyRecommendationsProps {
  className?: string
  userId: string
}

export function StudyRecommendations({
  className,
  userId,
}: StudyRecommendationsProps) {
  // This would typically be fetched from an API
  const recommendations: Recommendation[] = [
    {
      id: "1",
      title: "Grammar Practice: Past Tense",
      description: "Strengthen your understanding of past tense usage",
      type: "exercise",
      difficulty: "intermediate",
      estimatedTime: "20 mins",
      icon: "pencil",
    },
    {
      id: "2",
      title: "Vocabulary Builder: Business Terms",
      description: "Learn essential business vocabulary",
      type: "resource",
      difficulty: "beginner",
      estimatedTime: "15 mins",
      icon: "book",
    },
    {
      id: "3",
      title: "Writing Exercise: Email Composition",
      description: "Practice writing professional emails",
      type: "practice",
      difficulty: "advanced",
      estimatedTime: "30 mins",
      icon: "mail",
    },
  ]

  const difficultyColor = {
    beginner: "text-green-500",
    intermediate: "text-yellow-500",
    advanced: "text-red-500",
  }

  const typeIcon = {
    exercise: Icons.dumbbell,
    resource: Icons.book,
    practice: Icons.pen,
  }

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recommendations.map((rec) => {
            const Icon = typeIcon[rec.type]
            return (
              <div
                key={rec.id}
                className="flex items-start space-x-4 rounded-lg border p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{rec.title}</h3>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        difficultyColor[rec.difficulty]
                      )}
                    >
                      {rec.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Icons.clock className="mr-1 h-4 w-4" />
                      {rec.estimatedTime}
                    </div>
                    <div className="flex items-center">
                      <Icons.tag className="mr-1 h-4 w-4" />
                      {rec.type}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6">
          <Button className="w-full">
            <Icons.plus className="mr-2 h-4 w-4" />
            View More Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
