"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface UpgradeCardProps {
  plan: string
}

export function UpgradeCard({ plan }: UpgradeCardProps) {
  if (plan !== 'free') return null

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center gap-4 mb-4">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-semibold">Upgrade to Pro</h3>
          <p className="text-sm text-muted-foreground">
            Get more documents, storage, and features
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <Button className="w-full">
          View Pro Features
        </Button>
      </div>
    </Card>
  )
}
