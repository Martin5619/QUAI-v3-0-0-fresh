"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface WelcomeStepProps {
  onNext: (data: { role: string }) => void
  onSkip: () => void
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  const handleRoleSelect = (role: string) => {
    onNext({ role })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome to QUAi</h1>
        <p className="text-muted-foreground">
          Let&apos;s get started by understanding how you&apos;ll be using QUAi
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card 
          className="cursor-pointer transition-colors hover:bg-muted/50 md:col-span-2"
          onClick={() => handleRoleSelect("PERSONAL")}
        >
          <CardHeader>
            <CardTitle>Personal User</CardTitle>
            <CardDescription>
              I want to explore QUAi for my personal use or evaluate it for my organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Icons.user className="h-12 w-12 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Learn and practice at your own pace</li>
                  <li>Try out all core features</li>
                  <li>Evaluate for potential team/organization use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => handleRoleSelect("STUDENT")}
        >
          <CardHeader>
            <CardTitle>Student</CardTitle>
            <CardDescription>
              I want to learn and take quizzes as part of my class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Icons.student className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => handleRoleSelect("TEACHER")}
        >
          <CardHeader>
            <CardTitle>Teacher</CardTitle>
            <CardDescription>
              I want to create quizzes and manage my classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Icons.teacher className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => handleRoleSelect("LEARNING_MANAGER")}
        >
          <CardHeader>
            <CardTitle>Learning Manager</CardTitle>
            <CardDescription>
              I want to manage teachers and curriculum for my institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Icons.manager className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => handleRoleSelect("CORPORATE_USER")}
        >
          <CardHeader>
            <CardTitle>Corporate User</CardTitle>
            <CardDescription>
              I want to manage my organization&apos;s learning programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Icons.corporate className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
      </div>
    </div>
  )
}
