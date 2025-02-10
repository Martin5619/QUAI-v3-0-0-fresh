'use client'

import { Button } from "@/components/ui/button"
import { 
  UserIcon as IconsUser, 
  GraduationCapIcon as IconsGraduationCap, 
  TeacherIcon as IconsTeacher, 
  SchoolIcon as IconsSchool, 
  BuildingIcon as IconsBuilding 
} from "@/components/ui/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface WelcomeStepProps {
  onNext: (data: { role: string }) => void
  onSkip: () => void
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <div className="mx-auto w-full space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to QUAi</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Let&apos;s get started by understanding how you&apos;ll be using QUAi
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card 
          className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
          onClick={() => onNext({ role: "PERSONAL" })}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconsUser className="h-5 w-5" />
              Personal User
            </CardTitle>
            <CardDescription>
              Explore QUAi for personal use or evaluate for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-muted-foreground">
              <li>Learn and practice at your own pace</li>
              <li>Access to core features</li>
              <li>Basic support</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
          onClick={() => onNext({ role: "STUDENT" })}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconsGraduationCap className="h-5 w-5" />
              Student
            </CardTitle>
            <CardDescription>
              Learn and take quizzes as part of your class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-muted-foreground">
              <li>Access class materials</li>
              <li>Take quizzes and assessments</li>
              <li>Track your progress</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
          onClick={() => onNext({ role: "TEACHER" })}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconsTeacher className="h-5 w-5" />
              Teacher
            </CardTitle>
            <CardDescription>
              Create quizzes and manage your classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-muted-foreground">
              <li>Create and manage courses</li>
              <li>Generate assessments</li>
              <li>Track student progress</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
          onClick={() => onNext({ role: "LEARNING_MANAGER" })}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconsSchool className="h-5 w-5" />
              Learning Manager
            </CardTitle>
            <CardDescription>
              Manage teachers and curriculum for your institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-muted-foreground">
              <li>Oversee multiple classes</li>
              <li>Manage teacher accounts</li>
              <li>Track institutional progress</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:border-primary hover:shadow-md md:col-span-2"
          onClick={() => onNext({ role: "ENTERPRISE" })}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconsBuilding className="h-5 w-5" />
              Enterprise
            </CardTitle>
            <CardDescription>
              Deploy QUAi across your organization with custom integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-muted-foreground">
              <li>Custom deployment options</li>
              <li>Advanced security features</li>
              <li>Dedicated support team</li>
              <li>API access and integrations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
      </div>
    </div>
  )
}
