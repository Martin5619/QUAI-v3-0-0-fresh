"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { OnboardingStepProps } from "../onboarding-wizard"
import { Icons } from "@/components/icons"

const TEAM_SIZES = [
  {
    id: "solo",
    name: "Personal User",
    description: "I'm using QUAi for individual learning and exploration",
    recommended: true,
  },
  {
    id: "small",
    name: "Small Team",
    description: "2-10 team members, perfect for small groups or classes",
  },
  {
    id: "medium",
    name: "Medium Team",
    description: "11-50 team members, ideal for departments or schools",
  },
  {
    id: "large",
    name: "Large Team",
    description: "50+ team members, suited for organizations or institutions",
  },
]

export function TeamStep({ onNext, onBack }: OnboardingStepProps) {
  const [selectedSize, setSelectedSize] = useState("solo")
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      await onNext({ teamSize: selectedSize })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">How Will You Use QUAi?</h2>
        <p className="text-muted-foreground mt-2">
          This helps us personalize your experience. You can always change this later.
        </p>
      </div>

      <RadioGroup 
        value={selectedSize} 
        onValueChange={setSelectedSize}
        className="grid gap-4"
      >
        {TEAM_SIZES.map((size) => (
          <div key={size.id}>
            <RadioGroupItem
              value={size.id}
              id={size.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={size.id}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div className="flex w-full items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{size.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {size.description}
                  </div>
                </div>
                {size.recommended && (
                  <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Recommended
                  </div>
                )}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  )
}
