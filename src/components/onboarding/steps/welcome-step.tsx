import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, GraduationCap, School, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Role_v3 } from "@prisma/client"

interface WelcomeStepProps {
  data: {
    role: Role_v3 | ""
  }
  onUpdate: (data: any) => void
  onNext: () => void
  isLoading: boolean
}

export function WelcomeStep({ data, onUpdate, onNext, isLoading }: WelcomeStepProps) {
  const handleRoleSelect = (roleId: Role_v3) => {
    console.log("[ONBOARDING] Selected role:", roleId)
    onUpdate({ role: roleId })
  }

  const handleContinue = () => {
    console.log("[ONBOARDING] Continue clicked, role:", data.role)
    onNext()
  }

  const roles = [
    {
      id: "PERSONAL_USER" as Role_v3,
      title: "Personal User",
      description: "Use QUAi for personal learning and document analysis",
      icon: FileText,
      features: [
        "Upload and analyze documents",
        "Ask questions about your content",
        "Get AI-powered insights",
        "Track your learning progress"
      ]
    },
    {
      id: "STUDENT" as Role_v3,
      title: "Student",
      description: "Enhance your learning with AI assistance",
      icon: GraduationCap,
      features: [
        "Study materials analysis",
        "Homework assistance",
        "Test preparation",
        "Learning progress tracking"
      ]
    },
    {
      id: "TEACHER" as Role_v3,
      title: "Teacher",
      description: "Empower your teaching with AI tools",
      icon: School,
      features: [
        "Create learning materials",
        "Grade assignments",
        "Track student progress",
        "Personalize learning paths"
      ]
    },
    {
      id: "LEARNING_MANAGER" as Role_v3,
      title: "Learning Manager",
      description: "Manage educational programs and teams",
      icon: Users,
      features: [
        "Team management",
        "Resource allocation",
        "Progress monitoring",
        "Analytics and reporting"
      ]
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to QUAi!</CardTitle>
        <CardDescription>
          Let's get started by selecting your role. This will help us personalize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.role === role.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <role.icon className="h-5 w-5" />
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-1">
                  {role.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!data.role || isLoading}
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
