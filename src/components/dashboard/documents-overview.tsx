"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Upload } from "lucide-react"

interface DocumentsOverviewProps {
  className?: string
  userId: string
}

export function DocumentsOverview({ className, userId }: DocumentsOverviewProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your first document or create a new one to get started
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Document
          </Button>
        </div>
      </div>
    </Card>
  )
}
