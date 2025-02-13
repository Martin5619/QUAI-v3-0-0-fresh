"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  FileText, 
  Upload, 
  HelpCircle, 
  Plus,
  FileQuestion,
  Settings
} from "lucide-react"
import Link from "next/link"

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  description: string
  href: string
  variant?: "default" | "outline"
}

function QuickAction({ 
  icon, 
  label, 
  description, 
  href,
  variant = "default"
}: QuickActionProps) {
  return (
    <Link href={href}>
      <Button
        variant={variant}
        className="w-full h-auto p-4 justify-start space-x-4"
      >
        {icon}
        <div className="flex flex-col items-start">
          <span className="font-semibold">{label}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </Button>
    </Link>
  )
}

interface QuickActionCenterProps {
  className?: string
  userId: string
}

export function QuickActionCenter({ className, userId }: QuickActionCenterProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        
        <div className="grid gap-4">
          <QuickAction
            icon={<FileText className="h-5 w-5" />}
            label="New Document"
            description="Create a new document from scratch"
            href="/documents/new"
          />
          
          <QuickAction
            icon={<Upload className="h-5 w-5" />}
            label="Upload Document"
            description="Upload an existing document"
            href="/documents/upload"
            variant="outline"
          />
          
          <QuickAction
            icon={<FileQuestion className="h-5 w-5" />}
            label="Ask Question"
            description="Ask questions about your documents"
            href="/questions/new"
          />
          
          <QuickAction
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            description="Configure your workspace"
            href="/settings"
            variant="outline"
          />
        </div>
      </div>
    </Card>
  )
}
