"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
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

interface PlanStepProps {
  userId: string
  onNext: (data: { plan: string }) => void
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

export function PlanStep({ userId, onNext }: PlanStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("personal")
  const [isLoading, setIsLoading] = useState(false)

  const plans: Plan[] = [
    {
      id: "personal",
      name: "Personal",
      description: "Perfect for individual learning and exploration",
      price: "Free",
      features: [
        "Access to core QUAi features",
        "Basic AI assistance",
        "Personal learning analytics",
        "Community support",
        "Standard response time",
      ],
      recommended: true,
    },
    {
      id: "personal_pro",
      name: "Personal Pro",
      description: "Enhanced features for serious learners",
      price: "$9.99/month",
      features: [
        "All Personal features",
        "Advanced AI assistance",
        "Priority support",
        "Custom learning paths",
        "Progress tracking",
        "Offline access",
      ],
      badge: "Most Popular",
    },
    {
      id: "team",
      name: "Team & Enterprise",
      description: "For organizations and educational institutions",
      price: "Contact Us",
      features: [
        "All Pro features",
        "Team collaboration",
        "Custom deployment",
        "Dedicated support",
        "Advanced analytics",
        "Custom integrations",
      ],
    },
  ]

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      onNext({ plan: selectedPlan })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Start with our free plan or upgrade for more features
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "cursor-pointer transition-all hover:border-primary",
              selectedPlan === plan.id && "border-2 border-primary",
              plan.recommended && "border-primary/50"
            )}
            onClick={() => setSelectedPlan(plan.id)}
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
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedPlan(plan.id)}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => onNext({ plan: "personal" })}>
          Start with Personal
        </Button>
        <Button onClick={handleContinue} disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue with {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        All plans include a 14-day free trial. No credit card required.
      </p>
    </div>
  )
}
