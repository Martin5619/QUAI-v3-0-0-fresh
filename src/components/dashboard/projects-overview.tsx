"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  name: string
  description: string
  progress: number
  status: "active" | "completed" | "paused"
  dueDate: string
}

interface ProjectsOverviewProps {
  className?: string
  userId: string
}

export function ProjectsOverview({ className, userId }: ProjectsOverviewProps) {
  const t = useTranslations("dashboard.projects")

  // This would typically be fetched from an API
  const projects: Project[] = [
    {
      id: "1",
      name: "Website Localization",
      description: "Translate marketing website to 5 languages",
      progress: 75,
      status: "active",
      dueDate: "2024-03-01",
    },
    {
      id: "2",
      name: "Mobile App Strings",
      description: "Update mobile app translations for v2.0",
      progress: 45,
      status: "active",
      dueDate: "2024-03-15",
    },
    {
      id: "3",
      name: "Documentation",
      description: "Technical documentation translation",
      progress: 100,
      status: "completed",
      dueDate: "2024-02-28",
    },
  ]

  const statusColor = {
    active: "bg-green-500",
    completed: "bg-blue-500",
    paused: "bg-yellow-500",
  }

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("title")}</CardTitle>
        <Button variant="outline" size="sm">
          <Icons.plus className="mr-2 h-4 w-4" />
          {t("newProject")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center space-x-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium leading-none">
                    {project.name}
                  </h3>
                  <Badge variant="secondary">{project.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Icons.calendar className="mr-1 h-4 w-4" />
                    {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Icons.barChart className="mr-1 h-4 w-4" />
                    {project.progress}%
                  </div>
                </div>
              </div>
              <div className="w-1/3">
                <Progress value={project.progress} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
