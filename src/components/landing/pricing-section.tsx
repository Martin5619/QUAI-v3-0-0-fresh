"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export const PricingSection_v2414 = () => {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Simple, Usage-Based Pricing</h2>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Start free and scale as you grow
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <PricingFeature>100 AI-generated questions</PricingFeature>
                <PricingFeature>Basic analytics</PricingFeature>
                <PricingFeature>Community support</PricingFeature>
                <PricingFeature>1GB document storage</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="relative border-primary">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>For serious learners and educators</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <PricingFeature>Unlimited AI-generated questions</PricingFeature>
                <PricingFeature>Advanced analytics</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
                <PricingFeature>10GB document storage</PricingFeature>
                <PricingFeature>Custom templates</PricingFeature>
                <PricingFeature>API access</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For organizations and institutions</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <PricingFeature>Custom deployment</PricingFeature>
                <PricingFeature>Dedicated support</PricingFeature>
                <PricingFeature>SLA guarantee</PricingFeature>
                <PricingFeature>Unlimited storage</PricingFeature>
                <PricingFeature>Custom AI models</PricingFeature>
                <PricingFeature>White labeling</PricingFeature>
                <PricingFeature>SSO & advanced security</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Usage Calculator */}
        <div className="mt-16 max-w-2xl mx-auto bg-background rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Calculate Your Usage</h3>
          {/* Usage calculator component will be added here */}
        </div>
      </div>
    </section>
  )
}

const PricingFeature = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 text-primary" />
      <span className="text-muted-foreground">{children}</span>
    </li>
  )
}
