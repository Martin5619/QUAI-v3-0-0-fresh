"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Plan_v3 } from "@prisma/client"

interface PlanStepProps {
  data: {
    plan: string
  }
  onUpdate: (data: { plan: string }) => void
  onNext: () => void
  isLoading: boolean
}

interface Plan {
  id: string
  name: string
  description: string
  price: string
  features: string[]
  badge?: string
  recommended?: boolean
}

export function PlanStep({ data, onUpdate, onNext, isLoading }: PlanStepProps) {
  console.log("[PLAN_STEP] Rendering with data:", data)

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for individual learning and exploration",
      price: "Free",
      features: [
        "3 Documents/month",
        "50 Questions/month",
        "100MB Storage",
        "1000 Tokens/month",
        "Basic Features",
      ],
      recommended: true,
    },
    {
      id: "pro",
      name: "Personal Pro",
      description: "Enhanced features for serious learners",
      price: "$9.99/month",
      features: [
        "50 Documents/month",
        "Unlimited Questions",
        "1GB Storage",
        "10000 Tokens/month",
        "Advanced Features",
        "Priority Support",
      ],
      badge: "Most Popular",
    },
    {
      id: "team",
      name: "Team",
      description: "For organizations and educational institutions",
      price: "Contact Us",
      features: [
        "Custom Limits",
        "Custom Token Allocation",
        "Advanced Admin Features",
        "SSO/Custom Auth",
        "Dedicated Support",
      ],
    },
  ]

  const handlePlanSelect = (planId: string) => {
    console.log("[PLAN_STEP] Selected plan:", planId)
    onUpdate({ plan: planId })
  }

  const handleContinue = () => {
    console.log("[PLAN_STEP] Continue clicked, plan:", data.plan)
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Plan</CardTitle>
        <CardDescription>
          Select a plan that best fits your needs. You can always upgrade later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                data.plan === plan.id && "border-2 border-primary",
                plan.recommended && "border-primary/50"
              )}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.badge && (
                    <Badge variant="secondary">{plan.badge}</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{plan.price}</div>
                {plan.price !== "Contact Us" && <div className="text-sm text-muted-foreground">/month</div>}
                <ul className="mt-4 space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Icons.check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={data.plan === plan.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {data.plan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!data.plan || isLoading}
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  )
}
