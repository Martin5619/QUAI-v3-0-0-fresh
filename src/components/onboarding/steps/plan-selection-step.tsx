'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PlanSelectionStepProps {
  onNext: (data: any) => void
  onBack: () => void
}

const plans = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Perfect for trying out QUAi',
    price: '£0/month',
    features: [
      '3 Documents/month',
      '50 Questions/month',
      '100MB Storage',
      '1000 Tokens/month',
      'Single User',
      'Basic Features'
    ]
  },
  {
    id: 'pro',
    name: 'Personal Pro',
    description: 'For power users who need more',
    price: '£19/month',
    features: [
      '50 Documents/month',
      'Unlimited Questions',
      '1GB Storage',
      '10000 Tokens/month',
      'Advanced Features',
      'Priority Support'
    ]
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Best for teams and organizations',
    price: 'Contact Us',
    features: [
      'Custom Document Limits',
      'Custom Token Allocation',
      'Advanced Admin Features',
      'SSO/Custom Auth',
      'Dedicated Support',
      'Custom Integrations'
    ]
  }
]

export function PlanSelectionStep({ onNext, onBack }: PlanSelectionStepProps) {
  const [selectedPlan, setSelectedPlan] = useState('free')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ plan: selectedPlan })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select a plan that best fits your needs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative p-6 ${selectedPlan === plan.id ? 'border-primary' : ''}`}>
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="absolute right-4 top-4"
                />
                <div className="space-y-4">
                  <h3 className="font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <p className="text-2xl font-bold">{plan.price}</p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  )
}
