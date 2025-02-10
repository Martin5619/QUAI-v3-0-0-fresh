'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

interface RoleSelectionStepProps {
  data: any
  onUpdate: (data: any) => void
  onBack: () => void
}

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'I want to learn and study more effectively'
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'I want to create and manage learning materials'
  },
  {
    id: 'researcher',
    title: 'Researcher',
    description: 'I want to analyze and organize research materials'
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'I want to enhance my professional knowledge'
  }
]

export function RoleSelectionStep({ data, onUpdate, onBack }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = React.useState(data.role || '')

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Choose Your Role</h1>
        <p className="text-muted-foreground">
          Select the role that best describes how you'll use QUAi
        </p>
      </div>

      <RadioGroup
        value={selectedRole}
        onValueChange={setSelectedRole}
        className="grid gap-4"
      >
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            <RadioGroupItem
              value={role.id}
              id={role.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={role.id}
              className="flex flex-col space-y-1 p-4 cursor-pointer rounded-lg border-2 border-muted peer-data-[state=checked]:border-primary"
            >
              <span className="font-medium">{role.title}</span>
              <span className="text-sm text-muted-foreground">
                {role.description}
              </span>
            </Label>
          </Card>
        ))}
      </RadioGroup>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => onUpdate({ role: selectedRole })}>
          Continue
        </Button>
      </div>
    </div>
  )
}
