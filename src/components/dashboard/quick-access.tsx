"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface QuickAccessProps {
  className?: string
  plan: "free" | "pro" | "team"
}

export function QuickAccess({ className, plan }: QuickAccessProps) {
  const router = useRouter()

  const features = [
    {
      title: "Upload Documents",
      description: "Add your study materials and generate questions",
      icon: Icons.upload,
      href: "/documents/upload",
      available: true,
    },
    {
      title: "Generate Questions",
      description: "Create practice questions instantly",
      icon: Icons.brain,
      href: "/generate",
      available: true,
    },
    {
      title: "Practice Sets",
      description: "Access your saved question sets",
      icon: Icons.layout,
      href: "/practice-sets",
      available: true,
    },
    {
      title: "Progress Reports",
      description: "View detailed learning analytics",
      icon: Icons.barChart,
      href: "/analytics",
      available: plan !== "free",
    },
  ]

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {features.map((feature) => (
        <Card
          key={feature.title}
          className={cn(
            "cursor-pointer transition-all hover:border-primary",
            !feature.available && "opacity-50"
          )}
        >
          <CardContent className="p-6">
            <div className="flex h-full flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="rounded-md bg-primary/10 p-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="flex-1 text-sm text-muted-foreground">
                {feature.description}
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start"
                disabled={!feature.available}
                onClick={() => router.push(feature.href)}
              >
                {feature.available ? (
                  <>
                    <Icons.arrowRight className="mr-2 h-4 w-4" />
                    Get Started
                  </>
                ) : (
                  <>
                    <Icons.lock className="mr-2 h-4 w-4" />
                    Pro Feature
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
